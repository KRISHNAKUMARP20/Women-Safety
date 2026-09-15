import { Request, Response } from 'express';
import { store } from '../database/store';
import { EmergencyService } from '../services/emergencyService';

export const policeController = {
  // Police Dashboard summary
  getDashboard: (req: Request, res: Response) => {
    const emergencies = store.getEmergencies();
    const active = emergencies.filter(
      (e) => e.status === 'active' || e.status === 'assigned' || e.status === 'in_progress'
    );
    const resolved = emergencies.filter((e) => e.status === 'resolved');
    const stations = store.getPoliceStations();

    res.json({
      success: true,
      stats: {
        activeCount: active.length,
        resolvedCount: resolved.length,
        totalStations: stations.length,
        averageEta: active.length > 0 ? (active.reduce((acc, e) => acc + e.etaMinutes, 0) / active.length).toFixed(1) : '4.2',
      },
      activeEmergencies: active,
      stations,
    });
  },

  // Get all registered police stations
  getStations: (req: Request, res: Response) => {
    const stations = store.getPoliceStations();
    res.json({ success: true, count: stations.length, stations });
  },

  // Dispatch / assign unit to emergency
  assignUnit: (req: Request, res: Response) => {
    const { emergencyId, officerName, officerPhone, stationId, note } = req.body;

    if (!emergencyId || !officerName) {
      return res.status(400).json({ success: false, message: 'emergencyId and officerName are required' });
    }

    const updated = EmergencyService.updateStatus(
      emergencyId,
      'assigned',
      { name: officerName, phone: officerPhone, stationId },
      note || `Dispatched quick response unit with officer: ${officerName}`
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    res.json({ success: true, message: 'Unit dispatched successfully', emergency: updated });
  },

  // Mark in progress / arrival
  markInProgress: (req: Request, res: Response) => {
    const { emergencyId, note } = req.body;
    const updated = EmergencyService.updateStatus(
      emergencyId,
      'in_progress',
      undefined,
      note || 'Responder on scene / engaged.'
    );
    res.json({ success: true, emergency: updated });
  },

  // Resolve emergency incident
  resolveEmergency: (req: Request, res: Response) => {
    const { emergencyId, officerName, resolutionNote } = req.body;
    const updated = EmergencyService.updateStatus(
      emergencyId,
      'resolved',
      { name: officerName },
      resolutionNote || 'Victim secured safely. Incident resolved.'
    );
    res.json({ success: true, message: 'Emergency resolved and closed', emergency: updated });
  },
};
