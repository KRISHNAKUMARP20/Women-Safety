export type UserRole = 'girl' | 'parent' | 'police' | 'admin';

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
  email?: string;
}

export interface SafeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  type: 'home' | 'college' | 'work' | 'other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContacts?: EmergencyContact[];
  safeZones?: SafeZone[];
  parentId?: string;
  wardIds?: string[];
  policeStationId?: string;
  badgeNumber?: string;
  createdAt: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  contactNumber: string;
  jurisdiction: string;
  activeOfficersCount: number;
  availableVehicles: number;
  distanceKm?: number;
  etaMinutes?: number;
}

export type EmergencyStatus = 'active' | 'assigned' | 'in_progress' | 'resolved' | 'cancelled';
export type EmergencySeverity = 'critical' | 'high' | 'medium';

export interface EmergencyNote {
  id: string;
  author: string;
  role: UserRole;
  text: string;
  timestamp: string;
}

export interface Emergency {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userBloodGroup?: string;
  lat: number;
  lng: number;
  address: string;
  accuracyMeters: number;
  batteryLevel?: number;
  status: EmergencyStatus;
  severity: EmergencySeverity;
  nearestStationId: string;
  nearestStationName: string;
  distanceKm: number;
  etaMinutes: number;
  assignedOfficerName?: string;
  assignedOfficerPhone?: string;
  assignedStationId?: string;
  isSilent: boolean;
  medicalInfo?: string;
  notes: EmergencyNote[];
  locationHistory: Array<{ lat: number; lng: number; timestamp: string }>;
  createdAt: string;
  resolvedAt?: string;
}

export interface NotificationAlert {
  id: string;
  type: 'sos' | 'geofence' | 'dispatch' | 'resolved' | 'system';
  title: string;
  message: string;
  targetRoles: UserRole[];
  targetUserId?: string;
  emergencyId?: string;
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy?: string;
  actorId?: string;
  role?: UserRole;
  target?: string;
  details: string;
  timestamp: string;
}

export type SystemAuditLog = AuditLog;
