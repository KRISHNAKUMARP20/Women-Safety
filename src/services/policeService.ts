import { PoliceStation } from '../types';

export const policeService = {
  async getStations(): Promise<PoliceStation[]> {
    const res = await fetch('/api/police/stations');
    const data = await res.json();
    return data.stations || [];
  },

  async registerStation(station: Omit<PoliceStation, 'id'>): Promise<PoliceStation> {
    const res = await fetch('/api/police/stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(station),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to add station');
    return data.station;
  },

  async updatePatrolUnits(stationId: string, activePatrolVehicles: number, activeOfficers: number): Promise<PoliceStation> {
    const res = await fetch(`/api/police/stations/${stationId}/units`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activePatrolVehicles, activeOfficers }),
    });
    const data = await res.json();
    return data.station;
  },
};
