import { Router, Request, Response } from 'express';
import { authController } from '../controllers/authController';
import { emergencyController } from '../controllers/emergencyController';
import { locationController } from '../controllers/locationController';
import { parentController } from '../controllers/parentController';
import { policeController } from '../controllers/policeController';
import { adminController } from '../controllers/adminController';
import { store } from '../database/store';

const router = Router();

// ==================== AUTH & USERS ====================
router.get('/auth/demo-users', authController.getDemoUsers);
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/forgot-password', authController.forgotPassword);
router.get('/auth/profile', authController.getProfile);
router.put('/auth/profile', authController.updateProfile);
router.put('/auth/contacts', authController.updateContacts);
router.put('/auth/safe-zones', authController.updateSafeZones);

// ==================== EMERGENCIES ====================
router.post('/emergencies/sos', emergencyController.triggerSOS);
router.get('/emergencies/active', emergencyController.getActive);
router.get('/emergencies', emergencyController.getAll);
router.get('/emergencies/:id', emergencyController.getById);
router.patch('/emergencies/:id/status', emergencyController.updateStatus);
router.post('/emergencies/:id/cancel', emergencyController.cancelSOS);
router.post('/emergencies/:id/notes', emergencyController.addNote);
router.patch('/emergencies/:id/location', emergencyController.updateLiveLocation);

// ==================== LOCATION & GEOFENCING ====================
router.post('/locations/sync', locationController.syncLocation);
router.get('/locations/nearby-stations', locationController.getNearbyStations);

// ==================== PARENT ====================
router.get('/parents/wards', parentController.getWards);
router.get('/parents/alerts', parentController.getAlerts);

// ==================== POLICE ====================
router.get('/police/dashboard', policeController.getDashboard);
router.get('/police/stations', policeController.getStations);
router.post('/police/assign', policeController.assignUnit);
router.post('/police/in-progress', policeController.markInProgress);
router.post('/police/resolve', policeController.resolveEmergency);

// ==================== ADMIN ====================
router.get('/admin/stats', adminController.getStats);
router.get('/admin/users', adminController.getUsers);
router.get('/admin/audit-logs', adminController.getAuditLogs);
router.post('/admin/stations', adminController.addPoliceStation);
router.post('/admin/reset', adminController.resetSeedData);

// ==================== REAL-TIME SSE STREAM ====================
router.get('/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial connected ping
  res.write(`data: ${JSON.stringify({ event: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  // Unsubscribe callback
  const unsubscribe = store.subscribeSSE((data) => {
    res.write(`data: ${data}\n\n`);
  });

  // Heartbeat every 25 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': ping\n\n');
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

export default router;
