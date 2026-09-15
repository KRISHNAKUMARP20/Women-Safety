import fs from 'fs';
import path from 'path';
import {
  User,
  PoliceStation,
  Emergency,
  NotificationAlert,
  AuditLog,
  EmergencyStatus,
  SafeZone,
  EmergencyContact,
} from '../models/types';
import {
  SEED_USERS,
  SEED_POLICE_STATIONS,
  SEED_EMERGENCIES,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS,
} from './seed';

const USERS_FILE = path.join(process.cwd(), 'server', 'database', 'users.json');

const loadUsers = (): User[] => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load users from disk', e);
  }
  return JSON.parse(JSON.stringify(SEED_USERS));
};

const saveUsers = (users: User[]) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error('Failed to save users to disk', e);
  }
};

class DataStore {
  private users: User[] = loadUsers();
  private policeStations: PoliceStation[] = JSON.parse(JSON.stringify(SEED_POLICE_STATIONS));
  private emergencies: Emergency[] = JSON.parse(JSON.stringify(SEED_EMERGENCIES));
  private notifications: NotificationAlert[] = JSON.parse(JSON.stringify(SEED_NOTIFICATIONS));
  private auditLogs: AuditLog[] = JSON.parse(JSON.stringify(SEED_AUDIT_LOGS));
  private sseClients: Array<(data: any) => void> = [];

  // SSE Real-time client subscription
  public subscribeSSE(client: (data: any) => void) {
    this.sseClients.push(client);
    return () => {
      this.sseClients = this.sseClients.filter((c) => c !== client);
    };
  }

  public broadcast(event: string, payload: any) {
    const data = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
    this.sseClients.forEach((client) => {
      try {
        client(data);
      } catch (err) {
        console.error('Failed to dispatch SSE event to client', err);
      }
    });
  }

  // Users
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.users.push(user);
    saveUsers(this.users);
    this.addAuditLog('USER_REGISTERED', user.name, user.role, `Registered new account: ${user.email}`);
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    saveUsers(this.users);
    return this.users[index];
  }

  public updateContacts(userId: string, contacts: EmergencyContact[]): EmergencyContact[] {
    const user = this.getUserById(userId);
    if (user) {
      user.emergencyContacts = contacts;
      saveUsers(this.users);
      this.addAuditLog('CONTACTS_UPDATED', user.name, user.role, `Updated ${contacts.length} emergency contacts.`);
    }
    return contacts;
  }

  public updateSafeZones(userId: string, safeZones: SafeZone[]): SafeZone[] {
    const user = this.getUserById(userId);
    if (user) {
      user.safeZones = safeZones;
      saveUsers(this.users);
      this.addAuditLog('SAFEZONES_UPDATED', user.name, user.role, `Configured ${safeZones.length} geofence safe zones.`);
    }
    return safeZones;
  }

  // Police Stations
  public getPoliceStations(): PoliceStation[] {
    return this.policeStations;
  }

  public getPoliceStationById(id: string): PoliceStation | undefined {
    return this.policeStations.find((p) => p.id === id);
  }

  public addPoliceStation(station: PoliceStation): PoliceStation {
    this.policeStations.push(station);
    this.broadcast('station_added', station);
    return station;
  }

  /**
   * Adapts stations around custom user coordinates for realistic demo anywhere in the world
   */
  public adaptStationsAroundLocation(lat: number, lng: number) {
    if (this.policeStations.length > 0) {
      const isFar =
        Math.abs(this.policeStations[0].lat - lat) > 1.0 ||
        Math.abs(this.policeStations[0].lng - lng) > 1.0;

      if (isFar) {
        this.policeStations = [
          {
            id: 'ps-local-1',
            name: 'Metropolitan Quick Response Police Station',
            address: 'Main Avenue Security Center',
            lat: lat + 0.008,
            lng: lng + 0.006,
            contactNumber: '112 / 911',
            jurisdiction: 'Immediate Urban District',
            activeOfficersCount: 16,
            availableVehicles: 5,
          },
          {
            id: 'ps-local-2',
            name: 'Community Patrol Post & Women Helpdesk',
            address: 'Civic Center Crossway',
            lat: lat - 0.009,
            lng: lng + 0.008,
            contactNumber: '1091 (Women Helpline)',
            jurisdiction: 'Residential & Commercial Sector',
            activeOfficersCount: 12,
            availableVehicles: 4,
          },
          {
            id: 'ps-local-3',
            name: 'Transit & Metro Security Headquarters',
            address: 'Transit Hub Terminal',
            lat: lat + 0.015,
            lng: lng - 0.012,
            contactNumber: '112-9988',
            jurisdiction: 'Transit Corridors',
            activeOfficersCount: 14,
            availableVehicles: 6,
          },
          {
            id: 'ps-local-4',
            name: 'Special Task Force Regional Command',
            address: 'Outer Ring Bypass',
            lat: lat - 0.018,
            lng: lng - 0.015,
            contactNumber: '112-4400',
            jurisdiction: 'Highway & Suburban Outposts',
            activeOfficersCount: 20,
            availableVehicles: 8,
          },
        ];
        this.broadcast('stations_updated', this.policeStations);
      }
    }
  }

  // Emergencies
  public getEmergencies(): Emergency[] {
    return this.emergencies;
  }

  public getEmergencyById(id: string): Emergency | undefined {
    return this.emergencies.find((e) => e.id === id);
  }

  public getActiveEmergencies(): Emergency[] {
    return this.emergencies.filter(
      (e) => e.status === 'active' || e.status === 'assigned' || e.status === 'in_progress'
    );
  }

  public getEmergenciesForUser(userId: string): Emergency[] {
    return this.emergencies.filter((e) => e.userId === userId);
  }

  public createEmergency(emergency: Emergency): Emergency {
    this.emergencies.unshift(emergency);
    this.addAuditLog(
      'SOS_TRIGGERED',
      emergency.userName,
      'girl',
      `Emergency #${emergency.id} initiated. Matched ${emergency.nearestStationName} (${emergency.distanceKm} km).`
    );
    this.broadcast('emergency_created', emergency);
    return emergency;
  }

  public updateEmergency(id: string, updates: Partial<Emergency>): Emergency | null {
    const index = this.emergencies.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const previous = this.emergencies[index];
    const updated = { ...previous, ...updates };
    this.emergencies[index] = updated;

    this.broadcast('emergency_updated', updated);
    return updated;
  }

  public addEmergencyNote(
    emergencyId: string,
    author: string,
    role: any,
    text: string
  ): Emergency | null {
    const emergency = this.getEmergencyById(emergencyId);
    if (!emergency) return null;

    const note = {
      id: `n-${Date.now()}`,
      author,
      role,
      text,
      timestamp: new Date().toISOString(),
    };

    emergency.notes.push(note);
    this.broadcast('emergency_updated', emergency);
    return emergency;
  }

  // Notifications
  public getNotifications(): NotificationAlert[] {
    return this.notifications;
  }

  public addNotification(notification: NotificationAlert): NotificationAlert {
    this.notifications.unshift(notification);
    this.broadcast('notification_received', notification);
    return notification;
  }

  public markNotificationAsRead(id: string) {
    const n = this.notifications.find((item) => item.id === id);
    if (n) n.read = true;
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public addAuditLog(action: string, performedBy: string, role: any, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      performedBy,
      role,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    this.broadcast('audit_logged', log);
  }

  // Reset to seed
  public resetToSeed() {
    this.users = JSON.parse(JSON.stringify(SEED_USERS));
    saveUsers(this.users);
    this.policeStations = JSON.parse(JSON.stringify(SEED_POLICE_STATIONS));
    this.emergencies = JSON.parse(JSON.stringify(SEED_EMERGENCIES));
    this.notifications = JSON.parse(JSON.stringify(SEED_NOTIFICATIONS));
    this.auditLogs = JSON.parse(JSON.stringify(SEED_AUDIT_LOGS));
    this.broadcast('store_reset', { success: true });
  }
}

export const store = new DataStore();
