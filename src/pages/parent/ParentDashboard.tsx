import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { LocationMap } from '../../components/LocationMap';
import { EmergencyCard } from '../../components/EmergencyCard';
import { User, Emergency } from '../../types';
import {
  Users,
  ShieldCheck,
  MapPin,
  Phone,
  Battery,
  AlertTriangle,
  Clock,
  Radio,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

import { IncomingCallModal } from '../../components/parent/IncomingCallModal';

interface ParentDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { activeEmergencies, currentLocation, isSimulatingLocation, toggleSimulation } =
    useEmergency();

  const [wards, setWards] = useState<any[]>([]);
  const [selectedWard, setSelectedWard] = useState<any | null>(null);
  const [incomingCallEmergency, setIncomingCallEmergency] = useState<Emergency | null>(null);
  const [handledCallIds, setHandledCallIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/parents/wards?parentId=${currentUser?.id || 'user-parent-1'}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.wards && d.wards.length > 0) {
          setWards(d.wards);
          setSelectedWard(d.wards[0]);
        } else {
          setWards([]);
          setSelectedWard(null);
        }
      })
      .catch((e) => {
        console.warn('Failed to load wards', e);
        setWards([]);
        setSelectedWard(null);
      });
  }, [currentUser?.id, activeEmergencies]);

  // If ANY emergency is triggered or ward matches, display the emergency takeover
  const activeWardEmergency =
    activeEmergencies.find((e) => wards.find((w) => w.id === e.userId)) ||
    (activeEmergencies.length > 0 ? activeEmergencies[0] : undefined);

  useEffect(() => {
    if (activeWardEmergency && !handledCallIds.has(activeWardEmergency.id)) {
      setIncomingCallEmergency(activeWardEmergency);
    }
  }, [activeWardEmergency, handledCallIds]);

  const handleCallFinished = () => {
    if (incomingCallEmergency) {
      setHandledCallIds((prev) => new Set(prev).add(incomingCallEmergency.id));
      setIncomingCallEmergency(null);
    }
  };

  const displayChild = selectedWard || wards[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Guardian Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Parent Guardian Console
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
            PARENT DASHBOARD & LIVE WARD MONITOR
          </h2>
          <p className="text-xs text-slate-500">
            Real-time child tracking, instant distress alerts, and automatic police station dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSimulation}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition ${
              isSimulatingLocation
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>{isSimulatingLocation ? '🚶 Simulation Active' : '🚶 Simulate Child Movement'}</span>
          </button>
        </div>
      </div>

      {/* CRITICAL CHILD LIVE STATUS CARD: NAME, PHONE, LIVE LOCATION & POLICE INTERCEPT */}
      <div className={`rounded-3xl border p-5 sm:p-6 transition shadow-md ${
        activeWardEmergency
          ? 'border-rose-500 bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 text-white animate-pulse'
          : 'border-indigo-100 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Child Identity & Phone */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={displayChild?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={displayChild?.name || 'No Ward'}
                className="h-16 w-16 rounded-2xl border-2 border-white/40 object-cover shadow"
              />
              <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900 ${
                activeWardEmergency ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
              }`} />
            </div>

            {displayChild ? (
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    activeWardEmergency
                      ? 'bg-rose-600 text-white border border-rose-400'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {activeWardEmergency ? '🚨 SOS DISTRESS BEACON ACTIVE' : '🟢 CHILD STATUS: SECURE & SAFE'}
                  </span>
                  <span className="text-[11px] text-slate-300">Daughter</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {displayChild.name}
                </h3>

                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-200">
                    <Phone className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="font-mono font-bold">{displayChild.phone}</span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <div className="flex items-center space-x-1 text-slate-300">
                    <Battery className="h-3.5 w-3.5 text-emerald-400" />
                    <span>88% Battery</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  No Ward Registered
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Please register a girl account and add your emergency contact number.
                </p>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {displayChild && (
              <a
                href={`tel:${displayChild.phone?.replace(/[^0-9+]/g, '')}`}
                className="flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 shadow-md transition"
              >
                <Phone className="h-4 w-4" />
                <span>Call Child ({displayChild.name?.split(' ')[0]})</span>
              </a>
            )}

            {activeWardEmergency && (
              <a
                href={`tel:${(activeWardEmergency.assignedOfficerPhone || '112').replace(/[^0-9+]/g, '')}`}
                className="flex items-center space-x-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-4 py-2.5 shadow-md transition"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Call Police Station (112)</span>
              </a>
            )}
          </div>
        </div>

        {/* Live GPS & Nearby Police Station Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
          {/* Child's Live Location */}
          <div className="rounded-2xl bg-white/10 p-3.5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-300 flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>Child's Live GPS Coordinates</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold">
                GPS LOCKED (±3m)
              </span>
            </div>
            <div className="text-base font-mono font-black text-white">
              {(activeWardEmergency?.lat ?? currentLocation.lat).toFixed(6)},{' '}
              {(activeWardEmergency?.lng ?? currentLocation.lng).toFixed(6)}
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {activeWardEmergency?.address || 'Near University Road & Outer Ring Rd, New Delhi'}
            </p>
          </div>

          {/* Automatic Nearby Police Station */}
          <div className={`rounded-2xl p-3.5 border space-y-1.5 ${
            activeWardEmergency
              ? 'bg-rose-900/60 border-rose-500/40 text-rose-100'
              : 'bg-white/10 border-white/10 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-300 flex items-center space-x-1">
                <ShieldAlert className="h-3.5 w-3.5 text-blue-400" />
                <span>Nearby Police Station (Auto-Dispatched)</span>
              </span>
              <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                {activeWardEmergency ? 'DISPATCHED' : 'ON STANDBY'}
              </span>
            </div>
            <div className="text-base font-bold text-white truncate">
              {activeWardEmergency?.nearestStationName || 'Central Women Safety & Quick Response HQ'}
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-300 font-semibold">
                Distance: ~1.1 km • Police ETA: ~{activeWardEmergency?.etaMinutes || 4} mins
              </span>
              <a
                href="tel:112"
                className="text-blue-300 hover:text-white font-bold underline flex items-center space-x-1"
              >
                <span>Call 112</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner if Ward is in SOS */}
      {activeWardEmergency && (
        <div className="rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-pulse">
          <div className="flex items-start space-x-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-rose-200 flex items-center space-x-2">
                <span>🚨 EMERGENCY ALERT RECEIVED FROM WARD</span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                {activeWardEmergency.userName} tapped One-Click SOS!
              </h3>
              <p className="text-xs text-rose-100 mt-1 max-w-xl">
                Live GPS location is streaming below. Alert has been routed to <strong>{activeWardEmergency.nearestStationName}</strong> (Police ETA ~{activeWardEmergency.etaMinutes} mins).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${activeWardEmergency.userPhone.replace(/[^0-9+]/g, '')}`}
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-rose-800 shadow-md hover:bg-rose-50 transition flex items-center space-x-1.5"
            >
              <Phone className="h-3.5 w-3.5 text-rose-600" />
              <span>Call Ward ({activeWardEmergency.userName.split(' ')[0]})</span>
            </a>
            <a
              href={`tel:${(activeWardEmergency.assignedOfficerPhone || '112').replace(/[^0-9+]/g, '')}`}
              className="rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-white/20 px-3.5 py-2.5 text-xs font-black text-white shadow-md transition flex items-center space-x-1.5"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Call Police Unit</span>
            </a>
          </div>
        </div>
      )}

      {/* Linked Wards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wards.map((ward) => {
          const emg = activeEmergencies.find((e) => e.userId === ward.id);
          const isSelected = selectedWard?.id === ward.id;

          return (
            <div
              key={ward.id}
              onClick={() => setSelectedWard(ward)}
              className={`cursor-pointer rounded-2xl border p-4 transition bg-white shadow-sm hover:shadow-md ${
                emg
                  ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/30'
                  : isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-600/15'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={ward.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={ward.name}
                    className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{ward.name}</h4>
                    <span className="text-xs text-slate-500 font-mono">{ward.phone}</span>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="rounded bg-rose-50 px-1.5 py-0.2 text-[10px] font-bold text-rose-700 border border-rose-200">
                        {ward.bloodGroup || 'O+'}
                      </span>
                      <span className="text-[10px] text-slate-400">Daughter</span>
                    </div>
                  </div>
                </div>

                <div>
                  {emg ? (
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-extrabold text-white animate-pulse">
                      SOS ACTIVE
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      SECURE
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Battery className="h-3.5 w-3.5 text-emerald-600" />
                  <span>82% Battery</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>GPS Tracking ON</span>
                </div>
                <a
                  href={`tel:${ward.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-lg bg-slate-100 p-1.5 text-slate-700 hover:bg-slate-200"
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Map & Incident Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Live GPS Location & Safe Zone Boundaries (Leaflet + OpenStreetMap)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Refreshed every 2.5s</span>
            </div>

            <LocationMap height="460px" />
          </div>
        </div>

        {/* Right Action & Alerts feed */}
        <div className="lg:col-span-4 space-y-6">
          {activeWardEmergency ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Active Incident Dossier
              </h4>
              <EmergencyCard emergency={activeWardEmergency} />
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Perimeter Security Nominal</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your ward is currently within verified boundaries. In the event of a safe zone departure or SOS trigger, you will receive real-time push and SMS alerts immediately.
              </p>

              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-2 border border-slate-100">
                <div className="font-semibold text-slate-800">Designated Safe Havens:</div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div>🏠 Home Residence (250m perimeter)</div>
                  <div>🏫 University Campus (600m perimeter)</div>
                  <div>🚇 Central Metro Interchange (300m perimeter)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <IncomingCallModal
        isOpen={!!incomingCallEmergency}
        emergency={incomingCallEmergency}
        onAccept={() => {
          // You could do more here if needed
        }}
        onDecline={handleCallFinished}
      />
    </div>
  );
};
