import React, { useState } from 'react';
import {
  Car,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Shield,
  Activity,
  ArrowRight,
  FileText,
  UserCheck,
  Send,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { Emergency } from '../../types';

export const ResponseStatus: React.FC = () => {
  const { emergencies, updateStatus, addNote } = useEmergency();
  const [selectedId, setSelectedId] = useState<string>(emergencies[0]?.id || '');
  const [noteText, setNoteText] = useState('');

  const selectedEmergency = emergencies.find((e) => e.id === selectedId) || emergencies[0];

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedEmergency) return;
    await addNote(selectedEmergency.id, noteText);
    setNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Activity className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-black">Dispatch Response Status</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track active response units, en route progress, and scene security confirmations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="rounded-2xl bg-slate-800 border border-slate-700 p-3">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total In Dispatches</span>
            <span className="text-base font-black text-amber-400">
              {emergencies.filter((e) => e.status === 'assigned' || e.status === 'active').length}
            </span>
          </div>
          <div className="rounded-2xl bg-slate-800 border border-slate-700 p-3">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Secured & Resolved</span>
            <span className="text-base font-black text-emerald-400">
              {emergencies.filter((e) => e.status === 'resolved').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Incident Selector + Response Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: List */}
        <div className="lg:col-span-1 rounded-3xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Select Incident for Status Audit
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {emergencies.map((emg) => {
              const isSelected = (selectedEmergency?.id === emg.id);
              return (
                <button
                  key={emg.id}
                  onClick={() => setSelectedId(emg.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {emg.userName}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        emg.status === 'active'
                          ? 'bg-rose-600 text-white'
                          : emg.status === 'assigned'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {emg.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {emg.nearestStationName} · ~{emg.etaMinutes}m ETA
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 columns: Selected Incident Progress */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEmergency ? (
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Incident Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedEmergency.userName}</h3>
                    <span className="text-xs font-bold text-slate-500">({selectedEmergency.userPhone})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Station: {selectedEmergency.nearestStationName} · Triggered at {new Date(selectedEmergency.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedEmergency.status === 'active' && (
                    <button
                      onClick={() =>
                        updateStatus(selectedEmergency.id, 'assigned', {
                          name: 'Officer D. Vance (Unit 12)',
                          phone: '+1-555-0188',
                        })
                      }
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
                    >
                      Assign Patrol Force
                    </button>
                  )}
                  {selectedEmergency.status === 'assigned' && (
                    <button
                      onClick={() => updateStatus(selectedEmergency.id, 'resolved')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
                    >
                      Mark Scene Secured
                    </button>
                  )}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Dispatch Lifecycle Progress
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-xs font-black text-emerald-800 flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>1. SOS Ingestion</span>
                    </span>
                    <p className="text-[11px] text-emerald-700">Coordinates & medical profile verified</p>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl border space-y-1 ${
                      selectedEmergency.status === 'assigned' || selectedEmergency.status === 'resolved'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="text-xs font-black flex items-center space-x-1">
                      <Car className="h-3.5 w-3.5" />
                      <span>2. Intercept Vector</span>
                    </span>
                    <p className="text-[11px]">
                      {selectedEmergency.assignedOfficerName || 'Awaiting unit dispatch'}
                    </p>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl border space-y-1 ${
                      selectedEmergency.status === 'resolved'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="text-xs font-black flex items-center space-x-1">
                      <Shield className="h-3.5 w-3.5" />
                      <span>3. Scene Secured</span>
                    </span>
                    <p className="text-[11px]">
                      {selectedEmergency.status === 'resolved' ? 'Confirmed Safe' : 'In Progress'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dispatch Action Notes */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Responder Dispatch Logs & Chronology
                </h4>
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-40 overflow-y-auto">
                  {(selectedEmergency.notes || []).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No notes logged yet.</p>
                  ) : (
                    selectedEmergency.notes?.map((n, i) => (
                      <div key={i} className="text-xs text-slate-700 flex items-start space-x-2">
                        <span className="font-mono text-slate-400">#{i + 1}</span>
                        <span>{typeof n === 'string' ? n : `${(n as any).author ? `[${(n as any).author}] ` : ''}${(n as any).text}`}</span>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Log responder status note (e.g. Unit arrived on scene)..."
                    className="flex-1 rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Post Note</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <p className="text-xs text-slate-500">No emergency incident selected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
