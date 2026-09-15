import { Request, Response } from 'express';
import { store } from '../database/store';
import { EmergencyService } from '../services/emergencyService';

export const emergencyController = {
  // Trigger SOS button
  triggerSOS: (req: Request, res: Response) => {
    try {
      const {
        userId,
        lat,
        lng,
        address,
        accuracy,
        batteryLevel,
        severity,
        isSilent,
        medicalInfo,
      } = req.body;

      if (!userId || lat === undefined || lng === undefined) {
        return res.status(400).json({
          success: false,
          message: 'userId, latitude, and longitude are required.',
        });
      }

      const emergency = EmergencyService.triggerSOS({
        userId,
        lat: Number(lat),
        lng: Number(lng),
        address,
        accuracy: Number(accuracy) || 8,
        batteryLevel: Number(batteryLevel) || 75,
        severity,
        isSilent: Boolean(isSilent),
        medicalInfo,
      });

      return res.status(201).json({
        success: true,
        message: 'SOS Alert dispatched to police stations and emergency contacts!',
        emergency,
      });
    } catch (error: any) {
      console.error('Error triggering SOS:', error);
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  },

  // Get active emergencies
  getActive: (req: Request, res: Response) => {
    const active = store.getActiveEmergencies();
    res.json({ success: true, count: active.length, emergencies: active });
  },

  // Get all emergencies (for history/reports)
  getAll: (req: Request, res: Response) => {
    const all = store.getEmergencies();
    res.json({ success: true, count: all.length, emergencies: all });
  },

  // Get single emergency by ID
  getById: (req: Request, res: Response) => {
    const { id } = req.params;
    const emergency = store.getEmergencyById(id);
    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }
    res.json({ success: true, emergency });
  },

  // Update status (e.g. assigned, in_progress, resolved)
  updateStatus: (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, officerDetails, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const updated = EmergencyService.updateStatus(id, status, officerDetails, note);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Emergency record not found' });
    }

    res.json({ success: true, message: `Status updated to ${status}`, emergency: updated });
  },

  // Cancel SOS
  cancelSOS: (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    const updated = EmergencyService.cancelSOS(id, reason);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    res.json({ success: true, message: 'SOS alert cancelled successfully', emergency: updated });
  },

  // Add incident note
  addNote: (req: Request, res: Response) => {
    const { id } = req.params;
    const { author, role, text } = req.body;

    if (!text || !author) {
      return res.status(400).json({ success: false, message: 'Author and text are required' });
    }

    const updated = store.addEmergencyNote(id, author, role || 'police', text);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    res.json({ success: true, emergency: updated });
  },

  // Update live coordinates during ongoing emergency
  updateLiveLocation: (req: Request, res: Response) => {
    const { id } = req.params;
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'lat and lng are required' });
    }

    const updated = EmergencyService.updateLocation(id, Number(lat), Number(lng));
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    res.json({ success: true, emergency: updated });
  },
};
