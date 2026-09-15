import React from 'react';
import { LocationMap } from '../../components/LocationMap';
import { useEmergency } from '../../context/EmergencyContext';
import { MapPin, Navigation, Activity, Compass } from 'lucide-react';

export const LiveLocation: React.FC = () => {
  const { currentLocation, isSimulatingLocation, toggleSimulation } = useEmergency();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">REAL-TIME GPS TRACKING</h2>
          <p className="text-xs text-slate-500">
            High-precision satellite geolocation with live breadcrumb trails and geofence verification.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSimulation}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition ${
              isSimulatingLocation
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{isSimulatingLocation ? '⏸️ Stop Walk Sim' : '▶️ Test Live Walk Simulation'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Latitude</div>
          <div className="text-base font-mono font-bold text-slate-900 mt-0.5">{currentLocation.lat.toFixed(6)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Longitude</div>
          <div className="text-base font-mono font-bold text-slate-900 mt-0.5">{currentLocation.lng.toFixed(6)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">GPS Accuracy</div>
          <div className="text-base font-bold text-emerald-600 mt-0.5">±{currentLocation.accuracy} meters</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Speed</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            {currentLocation.speed ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : 'Stationary'}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <LocationMap height="520px" />
      </div>
    </div>
  );
};
