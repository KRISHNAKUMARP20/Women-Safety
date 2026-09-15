import React, { useState } from 'react';
import { Clock, ShieldAlert, Download, Filter, Search, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const EmergencyLogs: React.FC = () => {
  const { emergencies } = useEmergency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'assigned' | 'resolved' | 'cancelled'>('all');

  const filtered = emergencies.filter((e) => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesSearch =
      e.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.userPhone.includes(searchTerm) ||
      e.nearestStationName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['IncidentID', 'WardName', 'Phone', 'Status', 'Timestamp', 'Station', 'AssignedOfficer', 'Lat', 'Lng', 'SilentSOS'];
    const rows = filtered.map((e) => [
      e.id,
      `"${e.userName}"`,
      `"${e.userPhone}"`,
      e.status,
      `"${new Date(e.createdAt).toISOString()}"`,
      `"${e.nearestStationName}"`,
      `"${e.assignedOfficerName || 'N/A'}"`,
      e.lat,
      e.lng,
      e.isSilent ? 'TRUE' : 'FALSE',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `emergency_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Clock className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-black text-slate-900">Emergency Incident Audit Logs</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system logs of all distress beacons, timestamps, responder notes, and dispatch telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={exportCSV}
            className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 transition flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {(['all', 'active', 'assigned', 'resolved', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search incident, name, or station..."
            className="w-full rounded-2xl border border-slate-200 pl-9 p-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Log ID / Status</th>
                <th className="px-5 py-3.5">Ward Citizen</th>
                <th className="px-5 py-3.5">Station & Unit</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Coordinates</th>
                <th className="px-5 py-3.5">Latest Responder Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{log.id.slice(0, 8)}</span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          log.status === 'active'
                            ? 'bg-rose-600 text-white'
                            : log.status === 'assigned'
                            ? 'bg-amber-100 text-amber-800'
                            : log.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <div className="text-[11px] text-slate-400">{log.userPhone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800">{log.nearestStationName}</div>
                    <div className="text-[11px] text-slate-400">
                      Officer: {log.assignedOfficerName || 'Sector Patrol'}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-slate-600">
                    {log.lat.toFixed(4)}, {log.lng.toFixed(4)}
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-xs truncate italic">
                    {(() => {
                      const lastNote = log.notes?.[log.notes.length - 1];
                      if (!lastNote) return 'No notes logged.';
                      return typeof lastNote === 'string' ? lastNote : lastNote.text;
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
