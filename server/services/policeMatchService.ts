import { PoliceStation } from '../models/types';

/**
 * Calculates great-circle distance between two geographic coordinates using the Haversine Formula.
 * Free, fast, client/server-side calculation with zero API cost.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Number(distance.toFixed(2)); // Distance in km rounded to 2 decimal places
}

export interface StationMatchResult {
  station: PoliceStation;
  distanceKm: number;
  etaMinutes: number;
}

export function matchNearestPoliceStation(
  userLat: number,
  userLng: number,
  stations: PoliceStation[]
): StationMatchResult | null {
  if (!stations || stations.length === 0) return null;

  const ranked = stations.map((station) => {
    const dist = calculateHaversineDistance(userLat, userLng, station.lat, station.lng);
    // Estimated response time: 2 min base reaction time + (dist * 1.8 mins/km with siren)
    const eta = Math.max(2, Math.round(2 + dist * 1.8));
    return {
      station,
      distanceKm: dist,
      etaMinutes: eta,
    };
  });

  ranked.sort((a, b) => a.distanceKm - b.distanceKm);
  return ranked[0];
}

export function getNearbyPoliceStations(
  userLat: number,
  userLng: number,
  stations: PoliceStation[],
  maxRadiusKm = 25
): StationMatchResult[] {
  return stations
    .map((station) => {
      const dist = calculateHaversineDistance(userLat, userLng, station.lat, station.lng);
      const eta = Math.max(2, Math.round(2 + dist * 1.8));
      return {
        station,
        distanceKm: dist,
        etaMinutes: eta,
      };
    })
    .filter((s) => s.distanceKm <= maxRadiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
