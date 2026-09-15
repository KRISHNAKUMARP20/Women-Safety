import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { LocationMap } from '../../components/LocationMap';
import { EmergencyCard } from '../../components/EmergencyCard';
import { Emergency, PoliceStation } from '../../types';
import {
  Shield,
  Radio,
  Clock,
  Car,
  Users,
  CheckCircle2,
  AlertOctagon,
  Search,
  Filter,
} from 'lucide-react';

interface PoliceDashboardProps {
  onSelectEmergency?: (emergency: Emergency) => void;
}

export const PoliceDashboard: React.FC<PoliceDashboardProps> = ({ onSelectEmergency }) => {
  const { activeEmergencies, emergencies, refreshEmergencies } = useEmergency();
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
    activeEmergencies[0] || null
  );
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'assigned' | 'resolved'>('all');

  useEffect(() => {
    fetch('/api/police/stations')
      .then((r) => r.json())
      .then((d) => {
        if (d.stations) setStations(d.stations);
      })
      .catch((e) => console.warn('Failed to load stations', e));
  }, []);

  const displayedEmergencies = emergencies.filter((e) => {
    if (filterStatus === 'all') return true;
    return e.status === filterStatus;
  });

  const totalActiveOfficers = stations.reduce((acc, s) => acc + s.activeOfficersCount, 0);
  const totalVehicles = stations.reduce((acc, s) => acc + s.availableVehicles, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              POLICE QUICK-ACTION COMMAND
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight mt-0.5">
            EMERGENCY DISPATCH & PATROL CONTROL
          </h2>
          <p className="text-xs text-slate-400">
            Automated Haversine incident matching, patrol car routing, and multi-station jurisdiction monitoring.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="rounded-xl bg-slate-800 px-3 py-2 border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patrol Vehicles</span>
            <span className="text-base font-bold text-white">{totalVehicles} Ready</span>
          </div>
          <div className="rounded-xl bg-slate-800 px-3 py-2 border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Force</span>
            <span className="text-base font-bold text-emerald-400">{totalActiveOfficers} Officers</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-rose-700">Critical Active Incidents</span>
          <div className="text-2xl font-black text-rose-900 mt-0.5">{activeEmergencies.length}</div>
          <span className="text-[10px] text-rose-600 font-semibold">Real-time GPS tracking</span>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-blue-700">Assigned In-Transit</span>
          <div className="text-2xl font-black text-blue-900 mt-0.5">
            {emergencies.filter((e) => e.status === 'assigned' || e.status === 'in_progress').length}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">Sirens active</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-700">Secured & Resolved</span>
          <div className="text-2xl font-black text-emerald-900 mt-0.5">
            {emergencies.filter((e) => e.status === 'resolved').length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Confirmed safe</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Police ETA</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">3.8 mins</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Via Haversine algorithm</span>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Live Incidents Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Regional Jurisdictions & Active Incident Vectors
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">OpenStreetMap Leaflet</span>
            </div>

            <LocationMap
              height="480px"
              showAllEmergencies={true}
              showPoliceStations={true}
              focusEmergencyId={selectedEmergency?.id}
            />
          </div>

          {/* Registered Stations List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Monitored Police Stations & Rapid Action Commands ({stations.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stations.map((s) => (
                <div key={s.id} className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs">
                  <div className="font-bold text-slate-900">{s.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{s.address}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-blue-700">📞 {s.contactNumber}</span>
                    <span>{s.activeOfficersCount} Officers · {s.availableVehicles} Cars</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Incidents Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <Radio className="h-4 w-4 text-rose-600" />
              <span>Incident Response Dossier ({displayedEmergencies.length})</span>
            </h3>

            <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold text-slate-600">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2 py-0.5 rounded-md ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-2 py-0.5 rounded-md ${filterStatus === 'active' ? 'bg-white text-rose-700 shadow-sm' : ''}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('resolved')}
                className={`px-2 py-0.5 rounded-md ${filterStatus === 'resolved' ? 'bg-white text-emerald-700 shadow-sm' : ''}`}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[720px] overflow-y-auto pr-1">
            {displayedEmergencies.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                No emergencies matching selected status filter.
              </div>
            ) : (
              displayedEmergencies.map((emg) => (
                <EmergencyCard
                  key={emg.id}
                  emergency={emg}
                  onSelectMap={(selected) => setSelectedEmergency(selected)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
