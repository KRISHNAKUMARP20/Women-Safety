import { Request, Response } from 'express';
import { store } from '../database/store';
import { PoliceStation } from '../models/types';

export const adminController = {
  // Overall system statistics and health metrics
  getStats: (req: Request, res: Response) => {
    const users = store.getUsers();
    const emergencies = store.getEmergencies();
    const stations = store.getPoliceStations();
    const notifications = store.getNotifications();
    const auditLogs = store.getAuditLogs();

    const activeEmergencies = emergencies.filter(
      (e) => e.status === 'active' || e.status === 'assigned' || e.status === 'in_progress'
    );
    const resolvedEmergencies = emergencies.filter((e) => e.status === 'resolved');
    const cancelledEmergencies = emergencies.filter((e) => e.status === 'cancelled');

    const totalOfficers = stations.reduce((acc, s) => acc + s.activeOfficersCount, 0);
    const totalVehicles = stations.reduce((acc, s) => acc + s.availableVehicles, 0);

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        girlsRegistered: users.filter((u) => u.role === 'girl').length,
        parentsRegistered: users.filter((u) => u.role === 'parent').length,
        policeOfficers: users.filter((u) => u.role === 'police').length,
        totalEmergencies: emergencies.length,
        activeEmergenciesCount: activeEmergencies.length,
        resolvedEmergenciesCount: resolvedEmergencies.length,
        cancelledEmergenciesCount: cancelledEmergencies.length,
        totalStations: stations.length,
        totalOfficers,
        totalVehicles,
        totalNotificationsDispatched: notifications.length,
        totalAuditLogs: auditLogs.length,
        avgResponseTimeMinutes: '4.1',
      },
    });
  },

  // Get all registered users
  getUsers: (req: Request, res: Response) => {
    const users = store.getUsers();
    res.json({ success: true, count: users.length, users });
  },

  // Get all audit trail logs
  getAuditLogs: (req: Request, res: Response) => {
    const logs = store.getAuditLogs();
    res.json({ success: true, count: logs.length, logs });
  },

  // Add or register new police station
  addPoliceStation: (req: Request, res: Response) => {
    const { name, address, lat, lng, contactNumber, jurisdiction, activeOfficersCount, availableVehicles } = req.body;

    if (!name || lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'name, lat, and lng are required.' });
    }

    const newStation: PoliceStation = {
      id: `ps-${Date.now()}`,
      name,
      address: address || 'Main Security Sector',
      lat: Number(lat),
      lng: Number(lng),
      contactNumber: contactNumber || '112',
      jurisdiction: jurisdiction || 'General Zone',
      activeOfficersCount: Number(activeOfficersCount) || 10,
      availableVehicles: Number(availableVehicles) || 3,
    };

    store.addPoliceStation(newStation);
    store.addAuditLog('STATION_ADDED', 'Admin Controller', 'admin', `Registered station ${name}`);

    res.status(201).json({ success: true, station: newStation });
  },

  // Reset entire system to seed state for fresh demo testing
  resetSeedData: (req: Request, res: Response) => {
    store.resetToSeed();
    res.json({ success: true, message: 'All demo data has been reset to pristine seed state.' });
  },
};
