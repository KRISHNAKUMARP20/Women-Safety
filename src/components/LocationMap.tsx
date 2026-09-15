import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Locate, Shield, Navigation, Play, Pause, Layers } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { PoliceStation, SafeZone } from '../types';

interface LocationMapProps {
  height?: string;
  focusEmergencyId?: string;
  showAllEmergencies?: boolean;
  showPoliceStations?: boolean;
  showSafeZones?: boolean;
  centerCoords?: { lat: number; lng: number };
  zoom?: number;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  height = '420px',
  focusEmergencyId,
  showAllEmergencies = true,
  showPoliceStations = true,
  showSafeZones = true,
  centerCoords,
  zoom = 14,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const { currentLocation, activeEmergencies, myActiveEmergency, toggleSimulation, isSimulatingLocation } =
    useEmergency();
  const { currentUser } = useAuth();
  const [stations, setStations] = useState<PoliceStation[]>([]);

  // Fetch police stations
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/police/stations`)
      .then((r) => r.json())
      .then((d) => {
        if (d.stations) setStations(d.stations);
      })
      .catch((e) => console.warn('Failed to load stations for map', e));
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = centerCoords?.lat || currentLocation.lat;
      const initialLng = centerCoords?.lng || currentLocation.lng;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom,
        zoomControl: false,
      });

      // OpenStreetMap Free Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control on bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Layers whenever locations, active emergencies, or safe zones change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const bounds = L.latLngBounds([]);

    // 1. Render User Marker
    const isUserInEmergency = Boolean(myActiveEmergency);
    const userLat = currentLocation.lat;
    const userLng = currentLocation.lng;
    bounds.extend([userLat, userLng]);

    const userIconHtml = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: ${
          isUserInEmergency ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.3)'
        }; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background-color: ${
          isUserInEmergency ? '#ef4444' : '#10b981'
        }; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
          ${isUserInEmergency ? 'SOS' : ''}
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userIconHtml,
      className: 'custom-user-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(group);
    userMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px; min-width: 160px;">
        <strong style="font-size: 13px; color: #0f172a;">${currentUser?.name || 'Your Location'}</strong><br/>
        <span style="font-size: 11px; color: ${isUserInEmergency ? '#ef4444' : '#10b981'}; font-weight: 600;">
          ${isUserInEmergency ? '⚠️ Active SOS Triggered' : '🟢 Secure & Protected'}
        </span><br/>
        <span style="font-size: 10px; color: #64748b;">GPS: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}</span>
      </div>
    `);

    // Accuracy Circle
    L.circle([userLat, userLng], {
      radius: Math.max(15, currentLocation.accuracy || 20),
      color: isUserInEmergency ? '#ef4444' : '#10b981',
      fillColor: isUserInEmergency ? '#ef4444' : '#10b981',
      fillOpacity: 0.1,
      weight: 1,
    }).addTo(group);

    // 2. Render Safe Zones
    if (showSafeZones && currentUser?.safeZones) {
      currentUser.safeZones.forEach((zone: SafeZone) => {
        bounds.extend([zone.lat, zone.lng]);
        const color = zone.type === 'home' ? '#059669' : zone.type === 'college' ? '#7c3aed' : '#d97706';

        L.circle([zone.lat, zone.lng], {
          radius: zone.radiusMeters,
          color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '4, 6',
        })
          .bindTooltip(`Safe Zone: ${zone.name}`, { permanent: false, direction: 'top' })
          .addTo(group);
      });
    }

    // 3. Render Police Stations
    if (showPoliceStations && stations.length > 0) {
      stations.forEach((st) => {
        bounds.extend([st.lat, st.lng]);
        const stationIconHtml = `
          <div style="background-color: #1e3a8a; color: white; width: 28px; height: 28px; border-radius: 8px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
            👮
          </div>
        `;
        const stIcon = L.divIcon({
          html: stationIconHtml,
          className: 'police-station-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const stMarker = L.marker([st.lat, st.lng], { icon: stIcon }).addTo(group);
        stMarker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
            <strong style="font-size: 13px; color: #1e3a8a;">${st.name}</strong><br/>
            <span style="font-size: 11px; color: #475569;">${st.address}</span><br/>
            <div style="margin-top: 6px; font-size: 11px; color: #0284c7; font-weight: 600;">
              📞 Emergency: ${st.contactNumber}
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
              Active Officers: ${st.activeOfficersCount} | Patrol Cars: ${st.availableVehicles}
            </div>
          </div>
        `);
      });
    }

    // 4. Render Active Emergencies and Dispatch Route Lines
    const emergenciesToRender = focusEmergencyId
      ? activeEmergencies.filter((e) => e.id === focusEmergencyId)
      : showAllEmergencies
      ? activeEmergencies
      : [];

    emergenciesToRender.forEach((emg) => {
      bounds.extend([emg.lat, emg.lng]);

      // If not current user, render victim marker
      if (emg.userId !== currentUser?.id) {
        const victimIconHtml = `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(225, 29, 72, 0.4); animation: ping 1s infinite;"></div>
            <div style="background: #e11d48; color: white; border: 2.5px solid white; border-radius: 50%; width: 22px; height: 22px; font-size: 9px; font-weight: bold; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              🚨
            </div>
          </div>
        `;
        const victimIcon = L.divIcon({
          html: victimIconHtml,
          className: 'emergency-victim-marker',
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const vMarker = L.marker([emg.lat, emg.lng], { icon: victimIcon }).addTo(group);
        vMarker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #e11d48; font-size: 13px;">🚨 SOS: ${emg.userName}</strong><br/>
            <span style="font-size: 11px; color: #334155;">Status: ${emg.status.toUpperCase()}</span><br/>
            <span style="font-size: 11px; color: #334155;">ETA: ~${emg.etaMinutes} mins (${emg.distanceKm} km)</span><br/>
            <a href="tel:${emg.userPhone}" style="color: #2563eb; font-size: 11px; font-weight: bold; text-decoration: underline;">
              Call: ${emg.userPhone}
            </a>
          </div>
        `);
      }

      // Draw route connecting victim to nearest station
      const targetStation = stations.find((s) => s.id === emg.nearestStationId) || stations[0];
      if (targetStation) {
        bounds.extend([targetStation.lat, targetStation.lng]);

        // Draw animated dashed dispatch line
        const polyline = L.polyline(
          [
            [emg.lat, emg.lng],
            [targetStation.lat, targetStation.lng],
          ],
          {
            color: '#ef4444',
            weight: 3.5,
            dashArray: '8, 8',
            opacity: 0.85,
          }
        ).addTo(group);

        polyline.bindTooltip(`Dispatch Vector: ${emg.distanceKm} km (ETA ~${emg.etaMinutes} mins)`, {
          sticky: true,
          direction: 'center',
          className: 'bg-white text-slate-800 text-xs px-2 py-1 rounded shadow-md border',
        });
      }

      // Draw breadcrumb history line if victim is moving
      if (emg.locationHistory && emg.locationHistory.length > 1) {
        const pathCoords: L.LatLngExpression[] = emg.locationHistory.map((h) => [h.lat, h.lng]);
        L.polyline(pathCoords, {
          color: '#f97316',
          weight: 2,
          opacity: 0.7,
        }).addTo(group);
      }
    });

    // Auto fit bounds if coordinates exist and user hasn't explicitly locked view
    if (bounds.isValid() && bounds.getNorthEast().distanceTo(bounds.getSouthWest()) > 10) {
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
    }
  }, [currentLocation, activeEmergencies, stations, showSafeZones, showPoliceStations, focusEmergencyId]);

  const handleCenterOnMe = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentLocation.lat, currentLocation.lng], 15, { animate: true });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Floating Interactive Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col space-y-2">
        <button
          onClick={handleCenterOnMe}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-md hover:bg-slate-50 transition border border-slate-200"
          title="Recenter on My Location"
        >
          <Locate className="h-4 w-4 text-emerald-600" />
        </button>

        <button
          onClick={toggleSimulation}
          className={`flex h-9 items-center space-x-1.5 px-2.5 rounded-xl shadow-md transition border text-xs font-semibold ${
            isSimulatingLocation
              ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
          title="Simulate walking path to test live GPS updates"
        >
          {isSimulatingLocation ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{isSimulatingLocation ? 'Walking' : 'Sim GPS'}</span>
        </button>
      </div>

      {/* Map Legend Bar */}
      <div className="absolute bottom-2 left-2 z-20 flex flex-wrap items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow border border-slate-200/80">
        <div className="flex items-center space-x-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>You</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-900" />
          <span>Police</span>
        </div>
        {activeEmergencies.length > 0 && (
          <div className="flex items-center space-x-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-rose-600 font-bold">Active SOS ({activeEmergencies.length})</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <span className="h-2.5 w-2.5 rounded-full border border-dashed border-purple-600 bg-purple-100" />
          <span>Safe Zones</span>
        </div>
      </div>
    </div>
  );
};
