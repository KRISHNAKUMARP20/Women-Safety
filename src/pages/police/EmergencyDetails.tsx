import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { EmergencyCard } from '../../components/EmergencyCard';
import { LocationMap } from '../../components/LocationMap';
import { Shield, FileText, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

export const EmergencyDetails: React.FC = () => {
  const { emergencies } = useEmergency();
  const [selectedId, setSelectedId] = useState<string>(emergencies[0]?.id || '');

  const selected = emergencies.find((e) => e.id === selectedId) || emergencies[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">INCIDENT DOSSIER ARCHIVE</h2>
          <p className="text-xs text-slate-500">
            Comprehensive audit logs, dispatch timeline, and resolution records for law enforcement documentation.
          </p>
        </div>

        {emergencies.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Select Case:</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {emergencies.map((e) => (
                <option key={e.id} value={e.id}>
                  #{e.id} - {e.userName} ({e.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selected ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-4">
            <EmergencyCard emergency={selected} />

            {/* Detailed Timeline Audit */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Incident Log & Timestamp Trail
              </h4>
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="relative pl-7 text-xs">
                  <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-rose-600 ring-4 ring-white" />
                  <div className="font-bold text-slate-900">SOS Signal Triggered</div>
                  <div className="text-slate-500 text-[11px]">{new Date(selected.createdAt).toLocaleString()}</div>
                  <div className="text-slate-600 mt-0.5">
                    Broadcasting accuracy: ±{selected.accuracyMeters}m. Nearest station: {selected.nearestStationName}.
                  </div>
                </div>

                {selected.notes.map((note) => (
                  <div key={note.id} className="relative pl-7 text-xs">
                    <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="font-bold text-slate-900">
                      {note.author} ({note.role.toUpperCase()})
                    </div>
                    <div className="text-slate-500 text-[11px]">{new Date(note.timestamp).toLocaleString()}</div>
                    <div className="text-slate-700 mt-0.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {note.text}
                    </div>
                  </div>
                ))}

                {selected.resolvedAt && (
                  <div className="relative pl-7 text-xs">
                    <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                    <div className="font-bold text-emerald-800">Incident Officially Resolved & Closed</div>
                    <div className="text-slate-500 text-[11px]">{new Date(selected.resolvedAt).toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Incident Location & Station Vector
              </div>
              <LocationMap height="440px" focusEmergencyId={selected.id} />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          No incident selected.
        </div>
      )}
    </div>
  );
};
