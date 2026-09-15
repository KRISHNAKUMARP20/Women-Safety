import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { LocationMap } from '../../components/LocationMap';
import { LiveTriggerRadar } from '../../components/admin/LiveTriggerRadar';
import { ActiveSOSList } from '../../components/admin/ActiveSOSList';
import { SystemStatusLogs } from '../../components/admin/SystemStatusLogs';
import { AlertWaitingMonitor } from '../../components/admin/AlertWaitingMonitor';
import { RegisteredUsersRoster } from '../../components/admin/RegisteredUsersRoster';
import {
  ShieldAlert,
  Users,
  Building,
  Activity,
  RotateCcw,
  CheckCircle,
  Plus,
  Radio,
  FileText,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  MapPin,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PoliceStation, Emergency } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { emergencies, activeEmergencies, refreshEmergencies } = useEmergency();
  const [stats, setStats] = useState<any>(null);
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showAddStation, setShowAddStation] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>(new Date().toLocaleTimeString());
  const [isCheckingAlerts, setIsCheckingAlerts] = useState(false);

  // Active view section tab filter
  const [activeSection, setActiveSection] = useState<'all' | 'triggers' | 'alerts' | 'logs' | 'map'>('all');
  const [focusEmergencyId, setFocusEmergencyId] = useState<string | undefined>(undefined);

  // New Station State
  const [stationName, setStationName] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [stationPhone, setStationPhone] = useState('+91-112-9805');
  const [stationJurisdiction, setStationJurisdiction] = useState('North City District');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) setStats(data.stats);
    } catch (e) {
      console.warn('Failed to load stats', e);
    }
  };

  const fetchStations = async () => {
    try {
      const res = await fetch('/api/police/stations');
      const data = await res.json();
      if (data.stations) setPoliceStations(data.stations);
    } catch (e) {
      console.warn('Failed to load police stations', e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchStations();
  }, []);

  const handleReset = async () => {
    if (!window.confirm('Reset all demo emergencies, locations, and audit logs to pristine seed state?')) {
      return;
    }
    try {
      setIsResetting(true);
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      await res.json();
      await refreshEmergencies();
      await fetchStats();
      await fetchStations();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (e) {
      console.error('Reset failed', e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationName.trim()) return;

    try {
      await fetch('/api/admin/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: stationName.trim(),
          address: stationAddress.trim() || 'Central City Security Belt',
          lat: 12.98 + Math.random() * 0.04 - 0.02,
          lng: 77.6 + Math.random() * 0.04 - 0.02,
          contactNumber: stationPhone,
          jurisdiction: stationJurisdiction,
          activeOfficersCount: 15,
          availableVehicles: 4,
        }),
      });

      setShowAddStation(false);
      setStationName('');
      setStationAddress('');
      fetchStats();
      fetchStations();
    } catch (e) {
      console.error('Failed to add station', e);
    }
  };

  const handleManualSync = async () => {
    try {
      setIsCheckingAlerts(true);
      await refreshEmergencies();
      await fetchStats();
      await fetchStations();
      setLastCheckTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setTimeout(() => setIsCheckingAlerts(false), 350);
    }
  };

  const handleSelectMapEmergency = (emergency: Emergency) => {
    setFocusEmergencyId(emergency.id);
    setActiveSection('map');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top National Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-rose-400">
              NATIONAL EMERGENCY COMMAND & DISPATCH CONSOLE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white">
            Real-Time Trigger Surveillance, SOS Operations & System Telemetry
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Continuous surveillance of distress triggers, algorithmic precinct dispatches, active SOS incident resolution,
            and real-time infrastructure audit trails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleManualSync}
            disabled={isCheckingAlerts}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-200 transition"
            title="Sync all live data"
          >
            <RefreshCw className={`h-4 w-4 ${isCheckingAlerts ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isCheckingAlerts ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>

          <button
            onClick={() => setShowAddStation(!showAddStation)}
            className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-black text-white shadow hover:bg-indigo-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Precinct</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Reset system to clean initial demo seed data"
          >
            <RotateCcw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Reset Demo'}</span>
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="flex items-center space-x-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-bold text-emerald-800 shadow-xs">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Demo database reset to pristine seed state. Ready for fresh operations testing!</span>
        </div>
      )}

      {/* DEDICATED REAL-TIME ALERT MONITOR: WAITING FOR ALERT FROM GIRL OR PARENT */}
      <AlertWaitingMonitor
        activeEmergencies={activeEmergencies}
        policeStations={policeStations}
        onSelectEmergency={handleSelectMapEmergency}
        onRefresh={handleManualSync}
      />

      {/* REGISTERED GIRLS & PARENTS STORED IN ADMIN SYSTEM */}
      <RegisteredUsersRoster onRefresh={handleManualSync} />

      {/* Add Station Drawer */}
      {showAddStation && (
        <form
          onSubmit={handleAddStation}
          className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950">
                Register New Police Precinct / Quick Response Base
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowAddStation(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Station Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Metro North Women Quick Response"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Address / Sector</label>
              <input
                type="text"
                placeholder="Ring Road Junction, Sector 5"
                value={stationAddress}
                onChange={(e) => setStationAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Emergency Hot Line</label>
              <input
                type="text"
                value={stationPhone}
                onChange={(e) => setStationPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Jurisdiction</label>
              <input
                type="text"
                value={stationJurisdiction}
                onChange={(e) => setStationJurisdiction(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-black text-white hover:bg-indigo-700 shadow"
            >
              Confirm Registration
            </button>
          </div>
        </form>
      )}

      {/* Surveillance Metrics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveSection('alerts')}
          className="cursor-pointer rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 shadow-sm hover:shadow transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-rose-800">Active SOS Alerts</span>
            <span className={`h-2.5 w-2.5 rounded-full ${activeEmergencies.length > 0 ? 'bg-rose-600 animate-ping' : 'bg-emerald-500'}`} />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1">{activeEmergencies.length}</div>
          <span className="text-[10px] font-semibold text-rose-800">
            {activeEmergencies.length > 0 ? 'Response required' : 'All clear'}
          </span>
        </div>

        <div
          onClick={() => setActiveSection('triggers')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm hover:shadow transition"
        >
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Dispatch Time</span>
          <div className="text-2xl font-black text-slate-900 mt-1">3.8 min</div>
          <span className="text-[10px] text-emerald-600 font-semibold">SLA Target &lt; 5m</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Police Bases</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats?.totalStations ?? policeStations.length ?? 5}</div>
          <span className="text-[10px] text-slate-500">{stats?.totalOfficers ?? 54} Officers on duty</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Patrol Vehicles</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">{stats?.totalVehicles ?? 18}</div>
          <span className="text-[10px] text-indigo-600 font-semibold">Quick response ready</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Wards</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats?.girlsRegistered ?? 2}</div>
          <span className="text-[10px] text-slate-500">Protected citizens</span>
        </div>

        <div
          onClick={() => setActiveSection('logs')}
          className="cursor-pointer rounded-2xl border border-purple-200 bg-purple-50/50 p-3.5 shadow-sm hover:shadow transition"
        >
          <span className="text-[10px] uppercase font-bold text-purple-700">Audit Logs</span>
          <div className="text-2xl font-black text-purple-900 mt-1">{stats?.totalAuditLogs ?? 32}</div>
          <span className="text-[10px] text-purple-600 font-semibold">Immutable records</span>
        </div>
      </div>

      {/* View Switcher Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveSection('all')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All Command Modules</span>
          </button>

          <button
            onClick={() => setActiveSection('triggers')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'triggers'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>1. Real-Time Triggers Radar</span>
            {activeEmergencies.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-900 text-[10px] font-black">
                {activeEmergencies.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('alerts')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'alerts'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>2. Active SOS Alerts List ({activeEmergencies.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('logs')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'logs'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white hover:bg-purple-50 text-purple-700 border border-purple-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>3. System Status Logs</span>
          </button>

          <button
            onClick={() => setActiveSection('map')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'map'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>4. Spatial Map</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Last Check: <strong className="text-slate-700">{lastCheckTime}</strong>
        </div>
      </div>

      {/* MODULE 1: REAL-TIME EMERGENCY TRIGGERS RADAR */}
      {(activeSection === 'all' || activeSection === 'triggers') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Module 1: Real-Time Emergency Triggers & Signal Surveillance
              </h3>
            </div>
            <span className="text-xs text-slate-400">Live Web Audio Siren & Auto-Dispatch Relay</span>
          </div>

          <LiveTriggerRadar
            emergencies={emergencies}
            activeEmergencies={activeEmergencies}
            onSelectEmergency={handleSelectMapEmergency}
            onRefresh={handleManualSync}
            onTriggerSuccess={handleManualSync}
          />
        </section>
      )}

      {/* MODULE 2: ACTIVE SOS ALERTS OPERATIONS LIST */}
      {(activeSection === 'all' || activeSection === 'alerts') && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Module 2: Active SOS Alerts & Police Dispatch Management
              </h3>
            </div>
            <span className="text-xs font-semibold text-indigo-600">
              {activeEmergencies.length} Incident(s) in Progress
            </span>
          </div>

          <ActiveSOSList
            emergencies={emergencies}
            policeStations={policeStations}
            onRefresh={handleManualSync}
            onSelectMap={handleSelectMapEmergency}
          />
        </section>
      )}

      {/* MODULE 3: SYSTEM STATUS & INFRASTRUCTURE AUDIT LOGS */}
      {(activeSection === 'all' || activeSection === 'logs') && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Module 3: System Status Logs, Security Audits & Service Telemetry
              </h3>
            </div>
            <span className="text-xs text-slate-400">Real-time SSE Event Stream & CSV Exporter</span>
          </div>

          <SystemStatusLogs onRefresh={handleManualSync} />
        </section>
      )}

      {/* MODULE 4: GEOGRAPHIC SPATIAL INCIDENT MAP */}
      {(activeSection === 'all' || activeSection === 'map') && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Module 4: Spatial Network Map & Nearest Response Station Overlay
              </h3>
            </div>
            <span className="text-xs text-slate-400">OpenStreetMap GPS Live Vectors</span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <LocationMap
              height="480px"
              focusEmergencyId={focusEmergencyId}
              showAllEmergencies={true}
              showPoliceStations={true}
              showSafeZones={true}
            />
          </div>
        </section>
      )}
    </div>
  );
};
