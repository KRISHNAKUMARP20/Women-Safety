import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { LocationMap } from '../../components/LocationMap';
import { SOSButton } from '../../components/SOSButton';
import {
  ShieldCheck,
  MapPin,
  Phone,
  Radio,
  Send,
  Heart,
  Volume2,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface GirlDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export const GirlDashboard: React.FC<GirlDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const {
    myActiveEmergency,
    currentLocation,
    toggleSiren,
    isSirenPlaying,
  } = useEmergency();

  const [checkInSent, setCheckInSent] = useState(false);
  const [fakeCallActive, setFakeCallActive] = useState(false);

  const handleSendCheckIn = () => {
    setCheckInSent(true);
    setTimeout(() => setCheckInSent(false), 4000);
  };

  const handleTriggerFakeCall = () => {
    setFakeCallActive(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Safety Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-md border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Guardian Protection Active
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Hello, {currentUser?.name?.split(' ')[0] || 'Priya'}
            </h1>
            <p className="text-xs text-slate-300 max-w-lg">
              Your real-time GPS coordinates are encrypted and connected to nearest emergency dispatch stations and family guardians.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSendCheckIn}
              className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{checkInSent ? '✓ Checked In Safe!' : 'Safe Check-In (Ping Parents)'}</span>
            </button>

            <button
              onClick={handleTriggerFakeCall}
              className="flex items-center space-x-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white border border-white/20 hover:bg-white/20 transition"
              title="Triggers a simulated urgent incoming call to escape an uncomfortable or dangerous situation"
            >
              <Phone className="h-4 w-4 text-purple-300" />
              <span>Fake Escape Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fake Call Modal */}
      {fakeCallActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 text-white p-6 text-center shadow-2xl border border-slate-700 animate-bounce">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-purple-400 animate-pulse">
              <Phone className="h-10 w-10 animate-wiggle" />
            </div>
            <h3 className="text-lg font-bold">Dad (Calling...)</h3>
            <p className="text-xs text-slate-400 mt-1">+91-98765-11111 (Home)</p>
            <div className="mt-8 flex justify-around">
              <button
                onClick={() => setFakeCallActive(false)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white font-bold shadow-lg hover:bg-rose-700"
              >
                Decline
              </button>
              <button
                onClick={() => setFakeCallActive(false)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: SOS & Location Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left SOS Trigger Column */}
        <div className="lg:col-span-5 space-y-6">
          <SOSButton />

          {/* Quick Helplines */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Direct Emergency Lines
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:112"
                className="flex items-center space-x-2 rounded-xl bg-rose-50 p-2.5 text-rose-900 border border-rose-200 hover:bg-rose-100 transition"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white font-bold text-xs">
                  112
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">National Police</div>
                  <div className="text-[10px] text-rose-600">Police & EMS</div>
                </div>
              </a>

              <a
                href="tel:1091"
                className="flex items-center space-x-2 rounded-xl bg-purple-50 p-2.5 text-purple-900 border border-purple-200 hover:bg-purple-100 transition"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs">
                  1091
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Women Helpline</div>
                  <div className="text-[10px] text-purple-600">24/7 Helpline</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Map & Protection Zone Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Live Protective Map (Leaflet + OpenStreetMap)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </span>
            </div>

            <LocationMap height="400px" />
          </div>

          {/* Safe Zones status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Safe Zones Perimeter ({currentUser?.safeZones?.length || 0})
              </h4>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('profile')}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Manage Geofences
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {currentUser?.safeZones?.map((z) => (
                <div
                  key={z.id}
                  className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-800">{z.name}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{z.type} · {z.radiusMeters}m radius</div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" title="Active" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
