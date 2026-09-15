import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Emergency, NotificationAlert, EmergencyStatus } from '../types';
import { emergencyService } from '../services/emergencyService';
import { socketService } from '../services/socketService';
import { locationService, LocationCoords } from '../services/locationService';
import { audioAlert } from '../utils/audioAlert';
import { useAuth } from './AuthContext';

interface EmergencyContextType {
  emergencies: Emergency[];
  activeEmergencies: Emergency[];
  myActiveEmergency: Emergency | null;
  activeOverlayEmergency: Emergency | null;
  isFullScreenSOSOpen: boolean;
  notifications: NotificationAlert[];
  currentLocation: LocationCoords;
  isSirenPlaying: boolean;
  isSimulatingLocation: boolean;
  triggerSOS: (options?: { isSilent?: boolean; severity?: any; medicalInfo?: string }) => Promise<Emergency>;
  cancelSOS: (emergencyId: string, reason?: string) => Promise<void>;
  updateStatus: (emergencyId: string, status: EmergencyStatus, officerDetails?: any, note?: string) => Promise<void>;
  addNote: (emergencyId: string, text: string) => Promise<void>;
  toggleSiren: () => void;
  toggleSimulation: () => void;
  dismissNotification: (id: string) => void;
  refreshEmergencies: () => Promise<void>;
  setIsFullScreenSOSOpen: (open: boolean) => void;
  openEmergencyOverlay: (emergency?: Emergency | null) => void;
  closeEmergencyOverlay: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationCoords>(locationService.getCoords());
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);
  const [isSimulatingLocation, setIsSimulatingLocation] = useState<boolean>(false);
  const [isFullScreenSOSOpen, setIsFullScreenSOSOpen] = useState<boolean>(false);
  const [manualOverlayEmergency, setManualOverlayEmergency] = useState<Emergency | null>(null);

  // Load emergencies
  const refreshEmergencies = useCallback(async () => {
    try {
      const data = await emergencyService.getAllEmergencies();
      setEmergencies(data);
    } catch (e) {
      console.error('Failed to load emergencies', e);
    }
  }, []);

  // Fetch initial emergencies & notifications
  useEffect(() => {
    refreshEmergencies();
    
    // Fallback polling for live location updates (every 3 seconds)
    const pollInterval = setInterval(() => {
      refreshEmergencies();
    }, 3000);

    // Subscribe to location updates
    const unsubLoc = locationService.subscribe((coords) => {
      setCurrentLocation(coords);
    });

    // Subscribe to real-time events via SSE
    const unsubCreated = socketService.on('emergency_created', (newEmg: Emergency) => {
      setEmergencies((prev) => [newEmg, ...prev.filter((e) => e.id !== newEmg.id)]);
      audioAlert.playAlertBeep();
    });

    const unsubUpdated = socketService.on('emergency_updated', (updatedEmg: Emergency) => {
      setEmergencies((prev) =>
        prev.map((e) => (e.id === updatedEmg.id ? updatedEmg : e))
      );
      if (updatedEmg.status === 'resolved' || updatedEmg.status === 'cancelled') {
        audioAlert.stopSiren();
        setIsSirenPlaying(false);
      }
    });

    const unsubNotif = socketService.on('notification_received', (notif: NotificationAlert) => {
      setNotifications((prev) => [notif, ...prev]);
      audioAlert.playAlertBeep();
    });

    const unsubReset = socketService.on('store_reset', () => {
      refreshEmergencies();
      audioAlert.stopSiren();
      setIsSirenPlaying(false);
    });

    return () => {
      unsubLoc();
      unsubCreated();
      unsubUpdated();
      unsubNotif();
      unsubReset();
    };
  }, [refreshEmergencies]);

  // Start watching location for current user
  useEffect(() => {
    if (currentUser?.id) {
      locationService.startWatch(currentUser.id);
    }
    return () => {
      locationService.stopWatch();
    };
  }, [currentUser?.id]);

  // Derive active emergencies
  const activeEmergencies = emergencies.filter(
    (e) => e.status === 'active' || e.status === 'assigned' || e.status === 'in_progress'
  );

  // Derive my active emergency (if user is girl)
  const myActiveEmergency =
    activeEmergencies.find((e) => e.userId === currentUser?.id) || null;

  // Auto-open overlay when user's emergency becomes active
  useEffect(() => {
    if (myActiveEmergency) {
      setIsFullScreenSOSOpen(true);
    } else if (!manualOverlayEmergency) {
      setIsFullScreenSOSOpen(false);
    }
  }, [myActiveEmergency?.id]);

  const activeOverlayEmergency = manualOverlayEmergency || myActiveEmergency;

  const openEmergencyOverlay = (emergency?: Emergency | null) => {
    if (emergency) {
      setManualOverlayEmergency(emergency);
    }
    setIsFullScreenSOSOpen(true);
  };

  const closeEmergencyOverlay = () => {
    setIsFullScreenSOSOpen(false);
    setManualOverlayEmergency(null);
  };

  // Sound siren if active emergency is not silent and status is critical
  useEffect(() => {
    if (myActiveEmergency && !myActiveEmergency.isSilent && myActiveEmergency.status === 'active') {
      // Promptly allow siren
      if (!isSirenPlaying) {
        audioAlert.startSiren();
        setIsSirenPlaying(true);
      }
    } else if (!myActiveEmergency && isSirenPlaying) {
      audioAlert.stopSiren();
      setIsSirenPlaying(false);
    }
  }, [myActiveEmergency, isSirenPlaying]);

  const toggleSiren = () => {
    if (isSirenPlaying) {
      audioAlert.stopSiren();
      setIsSirenPlaying(false);
    } else {
      audioAlert.startSiren();
      setIsSirenPlaying(true);
    }
  };

  const toggleSimulation = () => {
    if (!currentUser) return;
    const active = locationService.toggleSimulation(currentUser.id, (coords) => {
      setCurrentLocation(coords);
      // If there's an ongoing emergency, update its live GPS coordinates on server
      if (myActiveEmergency) {
        emergencyService.updateLocation(myActiveEmergency.id, coords.lat, coords.lng);
      }
    });
    setIsSimulatingLocation(active);
  };

  const triggerSOS = async (options?: { isSilent?: boolean; severity?: any; medicalInfo?: string }) => {
    if (!currentUser) throw new Error('User must be logged in to trigger SOS');

    const emg = await emergencyService.triggerSOS({
      userId: currentUser.id,
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      address: currentUser.address,
      accuracy: currentLocation.accuracy,
      batteryLevel: 82,
      severity: options?.severity || 'critical',
      isSilent: options?.isSilent || false,
      medicalInfo: options?.medicalInfo || currentUser.bloodGroup,
    });

    setEmergencies((prev) => [emg, ...prev.filter((e) => e.id !== emg.id)]);

    if (!options?.isSilent) {
      audioAlert.startSiren();
      setIsSirenPlaying(true);
    }

    setIsFullScreenSOSOpen(true);

    return emg;
  };

  const cancelSOS = async (emergencyId: string, reason = 'False Alarm') => {
    await emergencyService.cancelSOS(emergencyId, reason);
    audioAlert.stopSiren();
    setIsSirenPlaying(false);
    setIsFullScreenSOSOpen(false);
    setManualOverlayEmergency(null);
    await refreshEmergencies();
  };

  const updateStatus = async (
    emergencyId: string,
    status: EmergencyStatus,
    officerDetails?: any,
    note?: string
  ) => {
    const updated = await emergencyService.updateStatus(emergencyId, status, officerDetails, note);
    setEmergencies((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    if (status === 'resolved' || status === 'cancelled') {
      audioAlert.stopSiren();
      setIsSirenPlaying(false);
      setIsFullScreenSOSOpen(false);
      setManualOverlayEmergency(null);
    }
  };

  const addNote = async (emergencyId: string, text: string) => {
    if (!currentUser) return;
    const updated = await emergencyService.addNote(
      emergencyId,
      currentUser.name,
      currentUser.role,
      text
    );
    setEmergencies((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <EmergencyContext.Provider
      value={{
        emergencies,
        activeEmergencies,
        myActiveEmergency,
        activeOverlayEmergency,
        isFullScreenSOSOpen,
        notifications,
        currentLocation,
        isSirenPlaying,
        isSimulatingLocation,
        triggerSOS,
        cancelSOS,
        updateStatus,
        addNote,
        toggleSiren,
        toggleSimulation,
        dismissNotification,
        refreshEmergencies,
        setIsFullScreenSOSOpen,
        openEmergencyOverlay,
        closeEmergencyOverlay,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
