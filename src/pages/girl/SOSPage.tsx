import React from 'react';
import { SOSButton } from '../../components/SOSButton';
import { LocationMap } from '../../components/LocationMap';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { Phone, Shield, MapPin, Heart, AlertTriangle } from 'lucide-react';

export const SOSPage: React.FC = () => {
  const { myActiveEmergency, currentLocation } = useEmergency();
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">EMERGENCY SOS DISPATCH</h2>
          <p className="text-xs text-slate-500">
            Instant priority broadcast to nearest quick-response police station and designated emergency guardians.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
          <MapPin className="h-3.5 w-3.5 text-rose-500" />
          <span>GPS Active: ±{currentLocation.accuracy}m accuracy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main SOS Trigger Center */}
        <div className="lg:col-span-5 space-y-6">
          <SOSButton />

          {/* Quick Helpline Dials */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              One-Tap Emergency Helplines
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:112"
                className="flex items-center space-x-2 rounded-xl bg-rose-50 p-3 text-rose-900 border border-rose-200 hover:bg-rose-100 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white font-bold text-xs">
                  112
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">National SOS</div>
                  <div className="text-[10px] text-rose-600">Police / Medical</div>
                </div>
              </a>

              <a
                href="tel:1091"
                className="flex items-center space-x-2 rounded-xl bg-purple-50 p-3 text-purple-900 border border-purple-200 hover:bg-purple-100 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs">
                  1091
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Women Helpline</div>
                  <div className="text-[10px] text-purple-600">24/7 Rapid Help</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Live Map & Nearest Assistance */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Live Protective Map & Nearest Police Stations
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">OpenStreetMap Free</span>
            </div>

            <LocationMap height="360px" />
          </div>

          {/* User emergency contacts overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Notified Emergency Guardians ({currentUser?.emergencyContacts?.length || 0})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentUser?.emergencyContacts?.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.relation} · {c.phone}</div>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                    title={`Call ${c.name}`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
