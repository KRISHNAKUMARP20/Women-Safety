import { PoliceStation } from '../types';

export interface LocationCoords {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: string;
}

class LocationService {
  private watchId: number | null = null;
  private currentCoords: LocationCoords = {
    lat: 10.9598,
    lng: 78.0766,
    accuracy: 8,
    speed: 0,
    heading: 0,
    timestamp: new Date().toISOString(),
  };
  private listeners: Array<(coords: LocationCoords) => void> = [];
  private isSimulating = false;
  private simInterval: any = null;

  constructor() {
    this.initBrowserLocation();
  }

  // Get current stored or best coordinates
  public getCoords(): LocationCoords {
    return this.currentCoords;
  }

  public subscribe(callback: (coords: LocationCoords) => void) {
    this.listeners.push(callback);
    callback(this.currentCoords);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.currentCoords));
  }

  // Request browser geolocation
  public initBrowserLocation() {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.currentCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy || 10),
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          timestamp: new Date().toISOString(),
        };
        this.notify();
      },
      (err) => {
        console.warn('Geolocation access denied or unavailable, using fallback city coordinates', err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  // Start watching live position
  public startWatch(userId: string) {
    if (this.watchId !== null || typeof window === 'undefined') return;

    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          this.currentCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy || 10),
            speed: pos.coords.speed,
            heading: pos.coords.heading,
            timestamp: new Date().toISOString(),
          };
          this.notify();
          this.syncWithBackend(userId, this.currentCoords);
        },
        (err) => console.warn('watchPosition error:', err.message),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    }
  }

  public stopWatch() {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.simInterval) {
      clearInterval(this.simInterval);
      this.simInterval = null;
      this.isSimulating = false;
    }
  }

  // Toggle simulated movement (great for demo testing without walking outside!)
  public toggleSimulation(userId: string, onUpdate?: (coords: LocationCoords) => void): boolean {
    if (this.isSimulating) {
      if (this.simInterval) clearInterval(this.simInterval);
      this.isSimulating = false;
      return false;
    }

    this.isSimulating = true;
    let step = 0;
    const baseLat = this.currentCoords.lat;
    const baseLng = this.currentCoords.lng;

    this.simInterval = setInterval(() => {
      step += 1;
      // Gentle jitter / walking path
      const dLat = Math.sin(step * 0.2) * 0.0007 + step * 0.0001;
      const dLng = Math.cos(step * 0.2) * 0.0007;

      this.currentCoords = {
        lat: Number((baseLat + dLat).toFixed(6)),
        lng: Number((baseLng + dLng).toFixed(6)),
        accuracy: 5,
        speed: 1.4, // ~5 km/h walking speed
        heading: 45,
        timestamp: new Date().toISOString(),
      };

      this.notify();
      if (onUpdate) onUpdate(this.currentCoords);
      this.syncWithBackend(userId, this.currentCoords);
    }, 2500);

    return true;
  }

  public isSimActive(): boolean {
    return this.isSimulating;
  }

  // Set explicit coordinates (e.g. for map click or pinpointing)
  public setCoords(lat: number, lng: number, userId?: string) {
    this.currentCoords = {
      ...this.currentCoords,
      lat,
      lng,
      timestamp: new Date().toISOString(),
    };
    this.notify();
    if (userId) {
      this.syncWithBackend(userId, this.currentCoords);
    }
  }

  // Sync with backend API
  public async syncWithBackend(userId: string, coords: LocationCoords) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/locations/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          lat: coords.lat,
          lng: coords.lng,
          speed: coords.speed,
          heading: coords.heading,
          accuracy: coords.accuracy,
        }),
      });
    } catch (e) {
      // Background sync silent fail tolerance
    }
  }

  // Query nearby stations
  public async getNearbyStations(lat: number, lng: number, radius = 30): Promise<PoliceStation[]> {
    try {
      const res = await fetch(`/api/locations/nearby-stations?lat=${lat}&lng=${lng}&radius=${radius}`);
      const data = await res.json();
      return (data.stations || []).map((item: any) => ({
        ...item.station,
        distanceKm: item.distanceKm,
        etaMinutes: item.etaMinutes,
      }));
    } catch (e) {
      return [];
    }
  }
}

export const locationService = new LocationService();
