import { User, PoliceStation, Emergency, NotificationAlert, AuditLog } from '../models/types';

export const SEED_POLICE_STATIONS: PoliceStation[] = [
  {
    id: 'ps-1',
    name: 'Central Women Safety & Quick Response HQ',
    address: '14 MG Road, Downtown Safety Sector',
    lat: 12.9716,
    lng: 77.5946,
    contactNumber: '+91-112-9801',
    jurisdiction: 'Metro Central & Commercial Belt',
    activeOfficersCount: 18,
    availableVehicles: 6,
  },
  {
    id: 'ps-2',
    name: 'East Campus & Cyber Police Division',
    address: '88 Tech Park Boulevard, East Corridor',
    lat: 12.9850,
    lng: 77.6350,
    contactNumber: '+91-112-9802',
    jurisdiction: 'Tech Parks & Educational Institutions',
    activeOfficersCount: 14,
    availableVehicles: 4,
  },
  {
    id: 'ps-3',
    name: 'South Metro Rapid Action Station',
    address: '22 Metro Interchange, South Ring',
    lat: 12.9352,
    lng: 77.6245,
    contactNumber: '+91-112-9803',
    jurisdiction: 'Residential Hub & Transit Centers',
    activeOfficersCount: 12,
    availableVehicles: 5,
  },
  {
    id: 'ps-4',
    name: 'North Suburban Patrol Post',
    address: '05 Ring Road Junction, North Sector',
    lat: 13.0125,
    lng: 77.5850,
    contactNumber: '+91-112-9804',
    jurisdiction: 'Suburban Highways & Night Transit',
    activeOfficersCount: 10,
    availableVehicles: 3,
  },
  {
    id: 'ps-5',
    name: 'Westside Community Police Precinct',
    address: '34 Mall Avenue, Westside',
    lat: 12.9550,
    lng: 77.5550,
    contactNumber: '+91-112-9805',
    jurisdiction: 'Markets & Entertainment Hubs',
    activeOfficersCount: 15,
    availableVehicles: 4,
  }
];

export const SEED_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'System Admin',
    email: 'kk6308608@gmail.com',
    phone: '+91-00000-00000',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    // In a real app we'd hash the password. Here we might just attach it or check it in the controller if needed.
    // For demo purposes, we'll handle the exact credentials match in the authController.
  }
];

export const SEED_EMERGENCIES: Emergency[] = [];
export const SEED_NOTIFICATIONS: NotificationAlert[] = [];
export const SEED_AUDIT_LOGS: AuditLog[] = [];

