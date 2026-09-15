import React, { useState } from 'react';
import {
  Radio,
  AlertTriangle,
  MapPin,
  Clock,
  Car,
  CheckCircle2,
  Maximize2,
  Volume2,
  VolumeX,
  Filter,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { Emergency, EmergencyStatus } from '../../types';

export const PoliceEmergencyAlerts: React.FC = () => {
  const {
    emergencies,
    activeEmergencies,
    updateStatus,
    openEmergencyOverlay,
    isSirenPlaying,
    toggleSiren,
  } = useEmergency();

  const [filter, setFilter] = useState<'all' | 'active' | 'assigned' | 'resolved'>('all');
  const [selectedIncident, setSelectedIncident] = useState<Emergency | null>(activeEmergencies[0] || null);

  const displayedList = emergencies.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-rose-400">
              POLICE DISPATCH INTAKE
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1">
            Emergency Alerts & Dispatch Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incoming SOS distress beacons, severity classifications, and unit assignments.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSiren}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-2 text-xs font-bold transition border ${
              isSirenPlaying
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isSirenPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{isSirenPlaying ? 'Mute Station Alarm' : 'Test Siren'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {(['all', 'active', 'assigned', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab} Alerts ({tab === 'all' ? emergencies.length : emergencies.filter((e) => e.status === tab).length})
          </button>
        ))}
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {displayedList.map((emg) => {
          const isCritical = emg.status === 'active';
          return (
            <div
              key={emg.id}
              className={`rounded-2xl border p-5 transition shadow-xs ${
                isCritical
                  ? 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isCritical
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Radio className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-black text-slate-900">
                        {emg.userName}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          emg.status === 'active'
                            ? 'bg-rose-600 text-white'
                            : emg.status === 'assigned'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {emg.status}
                      </span>
                      {emg.isSilent && (
                        <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                          STEALTH SILENT SOS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Phone: {emg.userPhone} · Triggered {new Date(emg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEmergencyOverlay(emg)}
                    className="flex items-center space-x-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 text-xs font-black shadow-xs transition"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Open Intercept Overlay</span>
                  </button>
                </div>
              </div>

              {/* Data Strip */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start space-x-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">GPS Location:</span> {emg.lat.toFixed(5)}, {emg.lng.toFixed(5)}
                    <p className="text-[10px] text-slate-500">{emg.address || 'Live coordinate feed'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 text-slate-700">
                  <Car className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Nearest Station:</span> {emg.nearestStationName}
                    <p className="text-[10px] text-slate-500">Distance: ~{emg.distanceKm} km · ETA ~{emg.etaMinutes} mins</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  {emg.status === 'active' && (
                    <button
                      onClick={() =>
                        updateStatus(emg.id, 'assigned', {
                          name: 'Officer J. Miller (Patrol 4)',
                          phone: '+1-555-0199',
                        })
                      }
                      className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-black text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
                    >
                      Dispatch Patrol Vehicle
                    </button>
                  )}
                  {emg.status === 'assigned' && (
                    <button
                      onClick={() => updateStatus(emg.id, 'resolved')}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
                    >
                      Confirm Scene Secured (Resolve)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
