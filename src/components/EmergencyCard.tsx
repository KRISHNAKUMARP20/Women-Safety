import React, { useState } from 'react';
import {
  ShieldAlert,
  Phone,
  Clock,
  MapPin,
  Battery,
  UserCheck,
  CheckCircle,
  MessageSquare,
  Send,
  Navigation,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import { Emergency, EmergencyStatus } from '../types';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';

interface EmergencyCardProps {
  emergency: Emergency;
  onSelectMap?: (emergency: Emergency) => void;
  showActions?: boolean;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({
  emergency,
  onSelectMap,
  showActions = true,
}) => {
  const { updateStatus, addNote, openEmergencyOverlay } = useEmergency();
  const { activeRole } = useAuth();

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [officerName, setOfficerName] = useState('Patrol Unit 04 (Sgt. Anita Rao)');
  const [officerPhone, setOfficerPhone] = useState('+91-98765-99887');

  const getStatusBadge = (status: EmergencyStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700 animate-pulse border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
            <span>CRITICAL SOS</span>
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span>DISPATCHED</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            <span>ON SCENE</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>RESOLVED</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
            <span>CANCELLED</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleDispatch = async () => {
    await updateStatus(
      emergency.id,
      'assigned',
      { name: officerName, phone: officerPhone },
      `Dispatched responder: ${officerName}`
    );
    setShowDispatchModal(false);
  };

  const handleMarkInProgress = async () => {
    await updateStatus(emergency.id, 'in_progress', undefined, 'Unit arrived on scene, locating subject.');
  };

  const handleResolve = async () => {
    await updateStatus(
      emergency.id,
      'resolved',
      undefined,
      'Subject confirmed safe. Emergency closed by operator.'
    );
  };

  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    await addNote(emergency.id, noteText.trim());
    setNoteText('');
    setIsAddingNote(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 p-4 gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 font-bold">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900">{emergency.userName}</h4>
              {emergency.userBloodGroup && (
                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                  {emergency.userBloodGroup}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">#{emergency.id}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(emergency.status)}
          {onSelectMap && (
            <button
              onClick={() => onSelectMap(emergency)}
              className="flex items-center space-x-1 rounded-lg bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              title="Locate on Map"
            >
              <Navigation className="h-3 w-3 text-rose-600" />
              <span className="hidden sm:inline">Map</span>
            </button>
          )}
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 space-y-3 text-xs text-slate-600">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Nearest Station</span>
            <span className="font-semibold text-slate-800 text-[11px] truncate block" title={emergency.nearestStationName}>
              {emergency.nearestStationName}
            </span>
            <span className="text-[10px] text-rose-600 font-bold">
              {emergency.distanceKm} km · ETA ~{emergency.etaMinutes}m
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">GPS Coordinates</span>
            <span className="font-mono text-slate-700 font-semibold block text-[11px]">
              {emergency.lat.toFixed(4)}, {emergency.lng.toFixed(4)}
            </span>
            <span className="text-[10px] text-slate-400">Acc: ±{emergency.accuracyMeters}m</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Battery Level</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <Battery className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-800">{emergency.batteryLevel ?? 80}%</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reported Time</span>
            <div className="flex items-center space-x-1 mt-0.5 text-slate-700 font-semibold">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{new Date(emergency.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Assigned Responder Bar */}
        {emergency.assignedOfficerName ? (
          <div className="flex items-center justify-between rounded-xl bg-blue-50/70 p-2.5 border border-blue-100 text-blue-950">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <div>
                <span className="text-[10px] uppercase text-blue-600 font-bold block">Assigned Officer</span>
                <span className="font-semibold text-xs">{emergency.assignedOfficerName}</span>
              </div>
            </div>
            {emergency.assignedOfficerPhone && (
              <a
                href={`tel:${emergency.assignedOfficerPhone}`}
                className="flex items-center space-x-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 shadow-sm"
              >
                <Phone className="h-3 w-3" />
                <span>Call Unit</span>
              </a>
            )}
          </div>
        ) : (
          emergency.status === 'active' && (
            <div className="flex items-center justify-between rounded-xl bg-rose-50 p-2.5 border border-rose-100 text-rose-900">
              <div className="text-xs font-semibold">
                ⚠️ Awaiting quick response unit assignment
              </div>
              {(activeRole === 'police' || activeRole === 'admin') && (
                <button
                  onClick={() => setShowDispatchModal(true)}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  Dispatch Unit
                </button>
              )}
            </div>
          )
        )}

        {/* Notes Feed */}
        {emergency.notes && emergency.notes.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Incident Activity Stream:</span>
            <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
              {emergency.notes.map((n) => (
                <div key={n.id} className="rounded-lg bg-slate-50 p-2 text-[11px] border border-slate-100">
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span className="font-bold text-slate-700">{n.author} ({n.role})</span>
                    <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="mt-0.5 text-slate-700 leading-snug">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Note Input */}
        {isAddingNote ? (
          <form onSubmit={handleSendNote} className="flex space-x-1.5 pt-1">
            <input
              type="text"
              placeholder="Add field update or dispatch log..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="rounded-xl border border-slate-200 px-2 py-1.5 text-xs text-slate-500"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setIsAddingNote(true)}
              className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium"
            >
              <MessageSquare className="h-3 w-3" />
              <span>Add Incident Log</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Footer for Police / Admin / Parent */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 bg-slate-50/50 p-3 gap-2">
          <div className="flex items-center space-x-2">
            <a
              href={`tel:${emergency.userPhone}`}
              className="flex items-center space-x-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Victim</span>
            </a>
            <a
              href={`sms:${emergency.userPhone}`}
              className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span>SMS</span>
            </a>
            {emergency.status !== 'resolved' && emergency.status !== 'cancelled' && (
              <button
                onClick={() => openEmergencyOverlay(emergency)}
                className="flex items-center space-x-1 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 shadow-xs"
                title="Open high-visibility full-screen SOS overlay"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Fullscreen SOS</span>
              </button>
            )}
          </div>

          {(activeRole === 'police' || activeRole === 'admin') && (
            <div className="flex items-center space-x-2">
              {emergency.status === 'assigned' && (
                <button
                  onClick={handleMarkInProgress}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm"
                >
                  Mark On-Scene
                </button>
              )}

              {(emergency.status === 'active' ||
                emergency.status === 'assigned' ||
                emergency.status === 'in_progress') && (
                <button
                  onClick={handleResolve}
                  className="flex items-center space-x-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Mark Resolved</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dispatch Officer Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Dispatch Police Response Unit</h4>
            <p className="mt-1 text-xs text-slate-500">
              Assign patrol vehicle and responder to victim {emergency.userName}.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Responder / Patrol Vehicle</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Radio / Contact Phone</label>
                <input
                  type="text"
                  value={officerPhone}
                  onChange={(e) => setOfficerPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end space-x-2">
              <button
                onClick={() => setShowDispatchModal(false)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatch}
                className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
