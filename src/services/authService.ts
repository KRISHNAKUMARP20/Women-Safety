import { User, EmergencyContact, SafeZone } from '../types';

export const authService = {
  async getDemoUsers(): Promise<User[]> {
    const res = await fetch('/api/auth/demo-users');
    const data = await res.json();
    return data.users || [];
  },

  async login(userIdOrRole: { userId?: string; role?: string; email?: string; parentPhone?: string; password?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userIdOrRole),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');
    return { user: data.user, token: data.token };
  },

  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Registration failed');
    return { user: data.user, token: data.token };
  },

  async forgotPassword(payload: { email?: string; role?: string; newPassword?: string }): Promise<{ success: boolean; message: string; tempPin?: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Password reset failed');
    return data;
  },

  async getProfile(userId?: string): Promise<User> {
    const url = userId ? `/api/auth/profile?userId=${encodeURIComponent(userId)}` : '/api/auth/profile';
    const res = await fetch(url);
    const data = await res.json();
    return data.user;
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...updates }),
    });
    const data = await res.json();
    return data.user;
  },

  async updateContacts(userId: string, contacts: EmergencyContact[]): Promise<EmergencyContact[]> {
    const res = await fetch('/api/auth/contacts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, contacts }),
    });
    const data = await res.json();
    return data.contacts;
  },

  async updateSafeZones(userId: string, safeZones: SafeZone[]): Promise<SafeZone[]> {
    const res = await fetch('/api/auth/safe-zones', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, safeZones }),
    });
    const data = await res.json();
    return data.safeZones;
  },
};
