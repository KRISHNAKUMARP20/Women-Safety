import { Request, Response } from 'express';
import { store } from '../database/store';
import { calculateHaversineDistance, getNearbyPoliceStations } from '../services/policeMatchService';
import { NotificationService } from '../services/notificationService';

// In-memory track for last known geofence state per user
const userLastGeofenceState = new Map<string, { zoneId: string; zoneName: string; inside: boolean }>();

export const locationController = {
  // Sync live location from browser Geolocation API
  syncLocation: (req: Request, res: Response) => {
    const { userId, lat, lng, speed, heading, accuracy } = req.body;

    if (!userId || lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'userId, lat, and lng are required' });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    // Adapt stations if first location report is distant
    store.adaptStationsAroundLocation(latitude, longitude);

    const user = store.getUserById(userId);
    let geofenceEvent = null;

    // Check against user's safe zones
    if (user && user.safeZones && user.safeZones.length > 0) {
      for (const zone of user.safeZones) {
        // Distance in km -> convert to meters
        const distKm = calculateHaversineDistance(latitude, longitude, zone.lat, zone.lng);
        const distMeters = distKm * 1000;
        const isInside = distMeters <= zone.radiusMeters;
        const lastState = userLastGeofenceState.get(`${userId}-${zone.id}`);

        if (lastState && lastState.inside !== isInside) {
          // Status changed!
          const status = isInside ? 'entered' : 'exited';
          NotificationService.sendGeofenceAlert({
            userName: user.name,
            zoneName: zone.name,
            status,
            lat: latitude,
            lng: longitude,
          });
          geofenceEvent = { zoneName: zone.name, status, distanceMeters: Math.round(distMeters) };
        }

        userLastGeofenceState.set(`${userId}-${zone.id}`, {
          zoneId: zone.id,
          zoneName: zone.name,
          inside: isInside,
        });
      }
    }

    // Broadcast live location tick to parents/police tracking
    store.broadcast('location_update', {
      userId,
      lat: latitude,
      lng: longitude,
      speed: speed || 0,
      heading: heading || 0,
      accuracy: accuracy || 10,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      lat: latitude,
      lng: longitude,
      geofenceEvent,
      timestamp: new Date().toISOString(),
    });
  },

  // Get nearby police stations using Haversine formula
  getNearbyStations: (req: Request, res: Response) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius) || 30;

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: 'Valid lat and lng query params required' });
    }

    const stations = store.getPoliceStations();
    const ranked = getNearbyPoliceStations(lat, lng, stations, radius);

    res.json({
      success: true,
      count: ranked.length,
      stations: ranked,
    });
  },
};
