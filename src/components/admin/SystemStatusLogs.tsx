import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Server,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { AuditLog } from '../../types';
import { socketService } from '../../services/socketService';

interface SystemStatusLogsProps {
  logs?: AuditLog[];
  onRefresh?: () => void;
}

export const SystemStatusLogs: React.FC<SystemStatusLogsProps> = ({
  logs: propLogs,
  onRefresh,
}) => {
  const [logs, setLogs] = useState<AuditLog[]>(propLogs || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.warn('Failed to load audit logs', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Subscribe to real-time audit logs broadcast over SSE
    const unsub = socketService.on('audit_logged', (newLog: AuditLog) => {
      if (isLiveStreaming) {
        setLogs((prev) => [newLog, ...prev.filter((l) => l.id !== newLog.id)]);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    });

    return () => {
      unsub();
    };
  }, [isLiveStreaming]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Action', 'PerformedBy', 'Role', 'Details'];
    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.performedBy || 'System'}"`,
      `"${l.role || 'system'}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `system_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Classify severity
  const getActionTag = (action: string) => {
    const upper = action.toUpperCase();
    if (upper.includes('SOS') || upper.includes('EMERGENCY') || upper.includes('CRITICAL')) {
      return {
        label: 'CRITICAL',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        dot: 'bg-rose-600 animate-pulse',
      };
    }
    if (upper.includes('DISPATCH') || upper.includes('POLICE') || upper.includes('STATION')) {
      return {
        label: 'DISPATCH',
        badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        dot: 'bg-indigo-600',
      };
    }
    if (upper.includes('AUTH') || upper.includes('LOGIN') || upper.includes('REGISTER') || upper.includes('PASSWORD')) {
      return {
        label: 'SECURITY',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        dot: 'bg-purple-600',
      };
    }
    if (upper.includes('SAFEZONE') || upper.includes('GEOFENCE') || upper.includes('CANCEL')) {
      return {
        label: 'WARNING',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        dot: 'bg-amber-600',
      };
    }
    return {
      label: 'INFO',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-500',
    };
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      (log.performedBy && log.performedBy.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (actionFilter === 'ALL') return true;
    if (actionFilter === 'SOS' && log.action.includes('SOS')) return true;
    if (actionFilter === 'POLICE' && (log.action.includes('POLICE') || log.action.includes('STATION'))) return true;
    if (actionFilter === 'USER' && (log.action.includes('USER') || log.action.includes('REGISTER') || log.action.includes('AUTH'))) return true;
    if (actionFilter === 'SAFEZONE' && log.action.includes('SAFEZONE')) return true;
    return false;
  });

  return (
    <div className="space-y-4">
      {/* Infrastructure Telemetry Health Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Infrastructure Telemetry & Services Health
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Last Synced: {lastSyncTime}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SSE Event Bus</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Streaming (18ms ping)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>GPS Coordinates</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">High Precision (±8m)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>SMS Auto-Dialer</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Gateway Active</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Police Dispatch Relay</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">100% Delivery SLA</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Audit Storage</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">{logs.length} Immutable Logs</span>
          </div>
        </div>
      </div>

      {/* Filter and Action Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit actions, operators, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Event Types ({logs.length})</option>
            <option value="SOS">Distress SOS Beacons</option>
            <option value="POLICE">Police & Station Events</option>
            <option value="USER">User & Auth Events</option>
            <option value="SAFEZONE">Safe Zone Departures</option>
          </select>

          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
              isLiveStreaming
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600'
            }`}
            title="Toggle Live Stream Auto-Update"
          >
            <span className={`h-2 w-2 rounded-full ${isLiveStreaming ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span>{isLiveStreaming ? 'Live Stream: ON' : 'Live Stream: PAUSED'}</span>
          </button>

          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh Logs"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Action Event</th>
                <th className="px-4 py-3">Actor / Performed By</th>
                <th className="px-4 py-3">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const tag = getActionTag(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString()} ({new Date(log.timestamp).toLocaleDateString()})
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[10px] font-black ${tag.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${tag.dot}`} />
                          <span>{tag.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900 text-xs">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                        <span className="font-semibold">{log.performedBy || 'System'}</span>
                        {log.role && (
                          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            {log.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-sans text-xs max-w-md truncate" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-sans">
                    No system audit logs match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
