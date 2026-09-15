import React, { useState } from 'react';
import { Emergency, PoliceStation } from '../../types';
import {
  Radio,
  ShieldAlert,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Building,
  User,
  Users,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

interface AlertWaitingMonitorProps {
  activeEmergencies: Emergency[];
  policeStations: PoliceStation[];
  onSelectEmergency?: (emergency: Emergency) => void;
  onRefresh?: () => void;
}

export const AlertWaitingMonitor: React.FC<AlertWaitingMonitorProps> = ({
  activeEmergencies,
  policeStations,
  onSelectEmergency,
  onRefresh,
}) => {
  const { triggerSOS } = useEmergency();
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateDistress = async () => {
    try {
      setIsSimulating(true);
      await triggerSOS({
        isSilent: false,
        medicalInfo: 'Blood Group: O+ • Asthmatic inhaler',
      });
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error('Failed to trigger simulation', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const hasAlert = activeEmergencies.length > 0;

  return (
    <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-white">
      {hasAlert ? (
        /* ACTIVE ALERT RECEIVED TAKEOVER STATE */
        <div className="bg-gradient-to-r from-rose-900 via-red-900 to-rose-950 text-white p-5 sm:p-6 border-b border-rose-700 animate-pulse">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/50">
                <ShieldAlert className="h-7 w-7 animate-bounce" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-rose-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-rose-200 border border-rose-400/40">
                    CRITICAL DISTRESS SIGNAL ACTIVE
                  </span>
                  <span className="text-[11px] font-mono text-rose-200">
                    {activeEmergencies.length} Active Incident(s)
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  EMERGENCY ALERT RECEIVED FROM GIRL / WARD
                </h3>
                <p className="text-xs text-rose-200 mt-0.5 max-w-xl">
                  Immediate dispatch protocol initiated. Real-time GPS stream active. Guardian contacts and local precinct alerted automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={onRefresh}
                className="rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 px-3.5 py-2 text-xs font-bold text-white transition"
              >
                Sync Radar
              </button>
            </div>
          </div>

          {/* Active Emergencies Cards */}
          <div className="mt-5 space-y-3">
            {activeEmergencies.map((emg) => (
              <div
                key={emg.id}
                className="rounded-2xl bg-black/40 border border-rose-400/30 p-4 text-xs text-slate-100 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping shrink-0" />
                    <div>
                      <span className="text-base font-black text-white">{emg.userName}</span>
                      <span className="text-slate-300 font-mono ml-2">({emg.userPhone})</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                      STATUS: {emg.status}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Triggered {new Date(emg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Girl & Live GPS */}
                  <div className="rounded-xl bg-white/5 p-2.5 border border-white/5 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-rose-400" />
                      <span>Live GPS Coordinates</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-white">
                      {emg.lat.toFixed(5)}, {emg.lng.toFixed(5)}
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">{emg.address}</div>
                  </div>

                  {/* Parent / Guardian Contact */}
                  <div className="rounded-xl bg-white/5 p-2.5 border border-white/5 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                      <Users className="h-3 w-3 text-amber-400" />
                      <span>Notified Parent / Guardian</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Generic Parent (Father)
                    </div>
                    <a
                      href="tel:+919876511111"
                      className="text-[11px] text-amber-300 font-mono hover:underline flex items-center space-x-1"
                    >
                      <Phone className="h-3 w-3" />
                      <span>+91-98765-11111</span>
                    </a>
                  </div>

                  {/* Auto-Dispatched Police Station */}
                  <div className="rounded-xl bg-white/5 p-2.5 border border-white/5 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                      <Building className="h-3 w-3 text-blue-400" />
                      <span>Nearest Police Dispatch</span>
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {emg.nearestStationName || 'Central Women Safety & Quick Response HQ'}
                    </div>
                    <div className="text-[11px] text-emerald-300 font-semibold">
                      ETA ~{emg.etaMinutes} mins • Patrol Unit Dispatched
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  {onSelectEmergency && (
                    <button
                      onClick={() => onSelectEmergency(emg)}
                      className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold px-3.5 py-1.5 text-xs transition shadow flex items-center space-x-1"
                    >
                      <span>Focus on Map</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* IDLE MONITOR STATE: WAITING FOR ALERT MESSAGES */
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-start space-x-4">
              {/* Animated Radar Graphic */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700">
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 animate-ping" />
                <div className="absolute h-10 w-10 rounded-full border border-emerald-500/40 animate-pulse" />
                <Radio className="h-7 w-7 text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>24/7 LIVE SURVEILLANCE ACTIVE</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Channel: SECURE-SOS-911
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  WAITING FOR ANY ALERT MESSAGE FROM PARENT OR GIRL
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">
                  System is actively listening for 1-click distress beacons from registered girls and guardian escalation notices from parents. When a distress message arrives, this monitor auto-triangulates the location and alerts the nearest precinct.
                </p>
              </div>
            </div>

            {/* Action to test live distress signal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <button
                id="btn-simulate-distress-alert"
                onClick={handleSimulateDistress}
                disabled={isSimulating}
                className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs px-4 py-2.5 shadow-lg shadow-rose-600/30 transition active:scale-95"
                title="Simulates a girl tapping the 1-click SOS button to test end-to-end alerting"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>{isSimulating ? 'Dispatching Test Alert...' : 'Simulate Distress from Girl'}</span>
              </button>
            </div>
          </div>

          {/* Telemetry Status Indicators */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700/60 text-xs">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Police Radio Link</span>
                <span className="font-bold text-white">100% ONLINE (156.8 MHz)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">GPS Triangulation</span>
                <span className="font-bold text-white">Active (±5m precision)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Wards</span>
                <span className="font-bold text-white">All Girls Protected</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Guardian Relays</span>
                <span className="font-bold text-white">Armed & Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
