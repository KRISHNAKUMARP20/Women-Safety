import { Emergency, EmergencyStatus, EmergencySeverity } from '../types';

export const emergencyService = {
  async triggerSOS(params: {
    userId: string;
    lat: number;
    lng: number;
    address?: string;
    accuracy?: number;
    batteryLevel?: number;
    severity?: EmergencySeverity;
    isSilent?: boolean;
    medicalInfo?: string;
  }): Promise<Emergency> {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/emergencies/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to trigger SOS');
    return data.emergency;
  },

  async getActiveEmergencies(): Promise<Emergency[]> {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/emergencies/active`);
    const data = await res.json();
    return data.emergencies || [];
  },

  async getAllEmergencies(): Promise<Emergency[]> {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/emergencies`);
    const data = await res.json();
    return data.emergencies || [];
  },

  async getEmergencyById(id: string): Promise<Emergency> {
    const res = await fetch(`/api/emergencies/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Emergency not found');
    return data.emergency;
  },

  async updateStatus(
    id: string,
    status: EmergencyStatus,
    officerDetails?: { name?: string; phone?: string; stationId?: string },
    note?: string
  ): Promise<Emergency> {
    const res = await fetch(`/api/emergencies/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, officerDetails, note }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update emergency status');
    return data.emergency;
  },

  async cancelSOS(id: string, reason = 'False Alarm'): Promise<Emergency> {
    const res = await fetch(`/api/emergencies/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to cancel SOS');
    return data.emergency;
  },

  async addNote(id: string, author: string, role: string, text: string): Promise<Emergency> {
    const res = await fetch(`/api/emergencies/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, role, text }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to add note');
    return data.emergency;
  },

  async updateLocation(id: string, lat: number, lng: number): Promise<Emergency> {
    const res = await fetch(`/api/emergencies/${id}/location`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
    });
    const data = await res.json();
    return data.emergency;
  },
};
