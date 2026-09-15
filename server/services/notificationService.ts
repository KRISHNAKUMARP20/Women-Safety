import { store } from '../database/store';
import { NotificationAlert, UserRole } from '../models/types';

export class NotificationService {
  /**
   * Simulates sending Firebase Cloud Messaging (FCM) & SMS to emergency contacts / authorities.
   */
  public static sendEmergencyAlert(params: {
    emergencyId: string;
    victimName: string;
    address: string;
    lat: number;
    lng: number;
    nearestStationName: string;
    distanceKm: number;
    contacts: string[];
    isSilent: boolean;
  }) {
    const alert: NotificationAlert = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type: 'sos',
      title: `EMERGENCY ALERT: ${params.victimName} needs immediate assistance!`,
      message: `Location: ${params.address || `${params.lat.toFixed(4)}, ${params.lng.toFixed(4)}`}. Dispatched to nearest station: ${params.nearestStationName} (${params.distanceKm} km). SMS dispatched to ${params.contacts.length} emergency contacts.`,
      targetRoles: ['parent', 'police', 'admin'],
      emergencyId: params.emergencyId,
      severity: 'high',
      timestamp: new Date().toISOString(),
      read: false,
    };

    store.addNotification(alert);
    return alert;
  }

  public static sendStatusUpdate(params: {
    emergencyId: string;
    title: string;
    message: string;
    targetRoles: UserRole[];
    severity?: 'high' | 'medium' | 'info';
  }) {
    const alert: NotificationAlert = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type: 'dispatch',
      title: params.title,
      message: params.message,
      targetRoles: params.targetRoles,
      emergencyId: params.emergencyId,
      severity: params.severity || 'medium',
      timestamp: new Date().toISOString(),
      read: false,
    };

    store.addNotification(alert);
    return alert;
  }

  public static sendGeofenceAlert(params: {
    userName: string;
    zoneName: string;
    status: 'entered' | 'exited';
    lat: number;
    lng: number;
  }) {
    const isExit = params.status === 'exited';
    const alert: NotificationAlert = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type: 'geofence',
      title: `Geofence Alert: ${params.userName} ${isExit ? 'left' : 'entered'} ${params.zoneName}`,
      message: `${params.userName} has ${isExit ? 'moved outside' : 'safely arrived at'} safe zone: "${params.zoneName}".`,
      targetRoles: ['parent', 'admin'],
      severity: isExit ? 'medium' : 'info',
      timestamp: new Date().toISOString(),
      read: false,
    };

    store.addNotification(alert);
    return alert;
  }
}
