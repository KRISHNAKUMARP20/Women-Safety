import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { LocationMap } from '../../components/LocationMap';
import { Emergency } from '../../types';
import { Shield, Navigation, Car, AlertTriangle, Phone, CheckCircle } from 'lucide-react';

export const LiveTracking: React.FC = () => {
  const { activeEmergencies, updateStatus } = useEmergency();
  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string | undefined>(
    activeEmergencies[0]?.id
  );

  const selectedEmergency = activeEmergencies.find((e) => e.id === selectedEmergencyId) || activeEmergencies[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">POLICE LIVE PATROL TRACKING</h2>
          <p className="text-xs text-slate-500">
            Real-time telemetry, victim GPS vector calculation, and intercept coordinates.
          </p>
        </div>

        {activeEmergencies.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600">Track Incident:</span>
            <select
              value={selectedEmergencyId || ''}
              onChange={(e) => setSelectedEmergencyId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {activeEmergencies.map((emg) => (
                <option key={emg.id} value={emg.id}>
                  {emg.userName} (#{emg.id}) - {emg.distanceKm}km away
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedEmergency ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <LocationMap
                height="540px"
                focusEmergencyId={selectedEmergency.id}
                showAllEmergencies={true}
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Target Telemetry
                </span>
                <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  LIVE GPS
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedEmergency.userName}</h3>
                <span className="text-xs text-slate-500">{selectedEmergency.userPhone}</span>
              </div>

              <div className="space-y-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Nearest Unit:</span>
                  <span className="font-bold text-slate-800">{selectedEmergency.nearestStationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Haversine Distance:</span>
                  <span className="font-bold text-rose-600">{selectedEmergency.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">ETA to Intercept:</span>
                  <span className="font-bold text-rose-600">~{selectedEmergency.etaMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Reported Address:</span>
                  <span className="font-semibold text-slate-700 text-right">{selectedEmergency.address}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <a
                  href={`tel:${selectedEmergency.userPhone}`}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Victim Directly</span>
                </a>

                {selectedEmergency.status === 'assigned' && (
                  <button
                    onClick={() =>
                      updateStatus(selectedEmergency.id, 'in_progress', undefined, 'Patrol arrived on scene.')
                    }
                    className="flex items-center justify-center space-x-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm"
                  >
                    <Car className="h-4 w-4" />
                    <span>Confirm Unit Arrival / On Scene</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    updateStatus(
                      selectedEmergency.id,
                      'resolved',
                      undefined,
                      'Victim safe. Incident logged and resolved by police officer.'
                    )
                  }
                  className="flex items-center justify-center space-x-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Close Incident / Mark Safe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-slate-400">
          <Shield className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No Active Emergency Incidents</h4>
          <p className="text-xs text-slate-500 mt-1">
            All jurisdictions nominal. Live tracking activates automatically upon SOS trigger.
          </p>
        </div>
      )}
    </div>
  );
};
