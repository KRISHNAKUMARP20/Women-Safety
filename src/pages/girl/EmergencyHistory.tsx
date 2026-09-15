import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Building,
  ShieldCheck,
  FileText,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';

export const EmergencyHistory: React.FC = () => {
  const { emergencies } = useEmergency();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'resolved' | 'cancelled'>('all');

  // Filter emergencies for this girl
  const myHistory = emergencies.filter(
    (e) => !currentUser || e.userId === currentUser.id
  );

  const filteredList = myHistory.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Clock className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-black text-slate-900">Emergency SOS History</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official chronological record of triggered distress beacons, responder notes, and resolutions.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {(['all', 'resolved', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                filter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f} ({f === 'all' ? myHistory.length : myHistory.filter((e) => e.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filteredList.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Incidents Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            You currently have no recorded emergency incidents in this filter category.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((item) => {
            const isResolved = item.status === 'resolved';
            const isCancelled = item.status === 'cancelled';
            const isActive = item.status === 'active';

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        isResolved
                          ? 'bg-emerald-50 text-emerald-600'
                          : isCancelled
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-rose-50 text-rose-600 animate-pulse'
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isCancelled ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-slate-900 uppercase">
                          Incident ID: {item.id.slice(0, 10)}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCancelled
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.isSilent && (
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                            Silent SOS
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                        <span>·</span>
                        <span>Severity: {item.severity.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs font-bold text-slate-700">
                      Dispatched: {item.nearestStationName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Distance: ~{item.distanceKm} km · ETA ~{item.etaMinutes}m
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-start space-x-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Coordinates:</span>{' '}
                      {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                      <p className="text-[10px] text-slate-400">{item.address || 'GPS Coordinates Stored'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-slate-600">
                    <Building className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Assigned Officer:</span>{' '}
                      {item.assignedOfficerName || 'Sector Patrol Unit'}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-slate-600">
                    <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Notes / Resolution:</span>
                      <p className="text-slate-500 italic mt-0.5">
                        {(() => {
                          const lastNote = item.notes?.[item.notes.length - 1];
                          if (!lastNote) return 'No further notes logged for this incident.';
                          return typeof lastNote === 'string' ? lastNote : lastNote.text;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
