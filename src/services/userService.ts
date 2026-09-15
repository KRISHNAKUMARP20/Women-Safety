import { User, EmergencyContact, SafeZone } from '../types';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/users`);
    const data = await res.json();
    return data.users || [];
  },

  async getUserById(id: string): Promise<User | null> {
    const res = await fetch(`/api/auth/profile?userId=${encodeURIComponent(id)}`);
    const data = await res.json();
    return data.user || null;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, ...updates }),
    });
    const data = await res.json();
    return data.user;
  },

  async updateContacts(userId: string, contacts: EmergencyContact[]): Promise<EmergencyContact[]> {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/contacts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, contacts }),
    });
    const data = await res.json();
    return data.contacts;
  },

  async updateSafeZones(userId: string, safeZones: SafeZone[]): Promise<SafeZone[]> {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/safe-zones`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, safeZones }),
    });
    const data = await res.json();
    return data.safeZones;
  },
};
