import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Phone,
  Building,
  Navigation,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Shield,
  Clock,
  Battery,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Send,
  Check,
} from 'lucide-react';
import { Emergency, PoliceStation, EmergencyStatus } from '../../types';
import { useEmergency } from '../../context/EmergencyContext';

interface ActiveSOSListProps {
  emergencies: Emergency[];
  policeStations: PoliceStation[];
  onRefresh: () => void;
  onSelectMap?: (emergency: Emergency) => void;
}

export const ActiveSOSList: React.FC<ActiveSOSListProps> = ({
  emergencies,
  policeStations,
  onRefresh,
  onSelectMap,
}) => {
  const { updateStatus, addNote } = useEmergency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'assigned' | 'in_progress' | 'silent'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Action Modal states
  const [actionEmergency, setActionEmergency] = useState<Emergency | null>(null);
  const [actionType, setActionType] = useState<'dispatch' | 'resolve' | 'note' | null>(null);
  const [officerName, setOfficerName] = useState('Patrol Unit 01 (Officer Khan)');
  const [officerPhone, setOfficerPhone] = useState('+91-98765-11201');
  const [selectedStationId, setSelectedStationId] = useState('');
  const [resolutionNote, setResolutionNote] = useState('Victim escorted to safe location. Threat neutralized.');
  const [incidentNote, setIncidentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active emergencies
  const activeEmergencies = emergencies.filter(
    (e) => e.status === 'active' || e.status === 'assigned' || e.status === 'in_progress'
  );

  // Filtered
  const filteredEmergencies = activeEmergencies.filter((em) => {
    // Search
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      em.userName.toLowerCase().includes(query) ||
      em.userPhone.includes(query) ||
      (em.address && em.address.toLowerCase().includes(query)) ||
      (em.nearestStationName && em.nearestStationName.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    // Status
    if (statusFilter === 'all') return true;
    if (statusFilter === 'silent') return em.isSilent;
    return em.status === statusFilter;
  });

  const handleCopyCoords = (em: Emergency) => {
    const text = `${em.lat.toFixed(6)}, ${em.lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedId(em.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDispatch = (em: Emergency) => {
    setActionEmergency(em);
    setActionType('dispatch');
    setSelectedStationId(em.nearestStationId || (policeStations[0]?.id ?? ''));
  };

  const handleOpenResolve = (em: Emergency) => {
    setActionEmergency(em);
    setActionType('resolve');
  };

  const handleOpenNote = (em: Emergency) => {
    setActionEmergency(em);
    setActionType('note');
    setIncidentNote('');
  };

  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionEmergency || !actionType) return;

    try {
      setIsSubmitting(true);
      if (actionType === 'dispatch') {
        const station = policeStations.find((s) => s.id === selectedStationId);
        await updateStatus(
          actionEmergency.id,
          'assigned',
          {
            name: officerName,
            phone: officerPhone,
            stationId: selectedStationId,
            stationName: station?.name || actionEmergency.nearestStationName,
          },
          `Unit ${officerName} dispatched from ${station?.name || actionEmergency.nearestStationName}.`
        );
      } else if (actionType === 'resolve') {
        await updateStatus(
          actionEmergency.id,
          'resolved',
          undefined,
          resolutionNote || 'Incident closed by Command Center administrator.'
        );
      } else if (actionType === 'note') {
        if (incidentNote.trim()) {
          await addNote(actionEmergency.id, incidentNote.trim());
        }
      }

      onRefresh();
      setActionEmergency(null);
      setActionType(null);
    } catch (err) {
      console.error('Action failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: EmergencyStatus, isSilent?: boolean) => {
    if (isSilent) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-200 animate-ping" />
          <span>SILENT PANIC</span>
        </span>
      );
    }
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-200" />
            <span>CRITICAL SOS</span>
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
            <Shield className="h-3 w-3" />
            <span>POLICE DISPATCHED</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
            <Clock className="h-3 w-3" />
            <span>PATROL EN ROUTE</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-600 text-white text-[10px] font-black uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search active alerts by victim, phone, station, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All Active ({activeEmergencies.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'active'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
            }`}
          >
            Critical ({activeEmergencies.filter((e) => e.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('assigned')}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'assigned'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
            }`}
          >
            Dispatched ({activeEmergencies.filter((e) => e.status === 'assigned').length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'in_progress'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
            }`}
          >
            In Progress ({activeEmergencies.filter((e) => e.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setStatusFilter('silent')}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'silent'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
            }`}
          >
            Silent ({activeEmergencies.filter((e) => e.isSilent).length})
          </button>
        </div>
      </div>

      {/* SOS Alerts List */}
      {filteredEmergencies.length > 0 ? (
        <div className="space-y-3.5">
          {filteredEmergencies.map((em) => {
            const isExpanded = expandedId === em.id;
            return (
              <div
                key={em.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="h-11 w-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                      SOS
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-slate-900">{em.userName}</span>
                        {em.userBloodGroup && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black">
                            {em.userBloodGroup}
                          </span>
                        )}
                        <span className="font-mono text-xs text-slate-400">#{em.id}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-rose-700">{em.userPhone}</span>
                        <span>•</span>
                        <span>
                          Triggered at {new Date(em.createdAt || (em as any).triggeredAt || Date.now()).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(em.status, em.isSilent)}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : em.id)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition"
                      title="Toggle Incident Dossier"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Location & Coordinates */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Live Incident Location
                    </span>
                    <span className="font-bold text-slate-800 truncate block" title={em.address}>
                      {em.address || 'Street level address'}
                    </span>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-1">
                      <span>{em.lat.toFixed(5)}, {em.lng.toFixed(5)}</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleCopyCoords(em)}
                          className="p-1 rounded hover:bg-slate-200 text-slate-600"
                          title="Copy Coordinates"
                        >
                          {copiedId === em.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <a
                          href={`https://www.google.com/maps?q=${em.lat},${em.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded hover:bg-slate-200 text-slate-600"
                          title="Open Google Maps"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Police Station & Dispatch */}
                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 block">
                      Assigned Police Precinct
                    </span>
                    <div className="flex items-center space-x-1.5 font-bold text-indigo-950 truncate">
                      <Building className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{em.nearestStationName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-indigo-700 font-semibold pt-1">
                      <span>Distance: {em.distanceKm ? em.distanceKm.toFixed(1) : '1.2'} km</span>
                      <span className="font-black">ETA ~{em.etaMinutes || 4} mins</span>
                    </div>
                  </div>

                  {/* Battery & Responders */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Telemetry & Responders
                    </span>
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                      <Battery className={`h-3.5 w-3.5 ${em.batteryLevel && em.batteryLevel < 20 ? 'text-rose-600' : 'text-emerald-600'}`} />
                      <span>{em.batteryLevel ?? 80}% Battery Remaining</span>
                    </div>
                    <div className="text-[11px] text-slate-600 truncate pt-1">
                      {em.assignedOfficerName ? (
                        <span className="font-bold text-indigo-700">Unit: {em.assignedOfficerName}</span>
                      ) : (
                        <span className="text-slate-400 italic">No field unit assigned yet</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Dossier */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Incident Log Notes & Audit Trail
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {em.notes && em.notes.length > 0 ? (
                        em.notes.map((n, i) => (
                          <div key={n.id || i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                              <span className="font-bold text-slate-700">{n.author} ({n.role})</span>
                              <span>{new Date(n.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-slate-800">{n.text}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded-xl">
                          No notes logged for this incident yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Operations Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${em.userPhone}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call Victim</span>
                    </a>

                    <button
                      onClick={() => handleOpenNote(em)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Add Log Note</span>
                    </button>

                    {onSelectMap && (
                      <button
                        onClick={() => onSelectMap(em)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        <span>Locate on Map</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {em.status === 'active' && (
                      <button
                        onClick={() => handleOpenDispatch(em)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition shadow-xs"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        <span>Dispatch Police Unit</span>
                      </button>
                    )}

                    {em.status === 'assigned' && (
                      <button
                        onClick={async () => {
                          await updateStatus(em.id, 'in_progress', undefined, 'Officer confirmed on-scene arrival.');
                          onRefresh();
                        }}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition shadow-xs"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>Mark Patrol En Route</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenResolve(em)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Resolve Incident</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="text-sm font-black text-slate-800">
            {searchTerm || statusFilter !== 'all' ? 'No Matching Active Alerts Found' : 'Zero Active SOS Alerts In Queue'}
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'Try resetting your search filter or selecting "All Active".'
              : 'All distress beacons have been addressed or resolved. System is monitoring incoming signals.'}
          </p>
        </div>
      )}

      {/* Action Dialog (Dispatch / Resolve / Add Note) */}
      {actionEmergency && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-slate-900">
                {actionType === 'dispatch' && 'Dispatch Police Quick-Response Unit'}
                {actionType === 'resolve' && 'Close & Resolve Distress Incident'}
                {actionType === 'note' && 'Add Incident Operational Note'}
              </h4>
              <button
                onClick={() => {
                  setActionEmergency(null);
                  setActionType(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleExecuteAction} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Incident Subject</span>
                <div className="font-bold text-slate-900 text-sm">{actionEmergency.userName} ({actionEmergency.userPhone})</div>
                <div className="text-slate-500 text-[11px] truncate">{actionEmergency.address}</div>
              </div>

              {actionType === 'dispatch' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Police Precinct</label>
                    <select
                      value={selectedStationId}
                      onChange={(e) => setSelectedStationId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                    >
                      {policeStations.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.jurisdiction})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assigned Officer / Unit</label>
                      <input
                        type="text"
                        required
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Officer Mobile</label>
                      <input
                        type="text"
                        required
                        value={officerPhone}
                        onChange={(e) => setOfficerPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                </>
              )}

              {actionType === 'resolve' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resolution Summary</label>
                  <textarea
                    rows={3}
                    required
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                  />
                </div>
              )}

              {actionType === 'note' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Operational Note Text</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter responder progress, victim condition, or escort confirmation..."
                    value={incidentNote}
                    onChange={(e) => setIncidentNote(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setActionEmergency(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
