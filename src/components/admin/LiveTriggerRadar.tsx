import React, { useState, useEffect } from 'react';
import {
  Radio,
  AlertTriangle,
  Volume2,
  VolumeX,
  Play,
  Clock,
  Phone,
  Battery,
  Navigation,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';
import { Emergency } from '../../types';
import { audioAlert } from '../../utils/audioAlert';

interface LiveTriggerRadarProps {
  emergencies: Emergency[];
  activeEmergencies: Emergency[];
  onSelectEmergency?: (emergency: Emergency) => void;
  onRefresh: () => void;
  onTriggerSuccess?: () => void;
}

export const LiveTriggerRadar: React.FC<LiveTriggerRadarProps> = ({
  activeEmergencies,
  onSelectEmergency,
  onRefresh,
  onTriggerSuccess,
}) => {
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  // Simulation form state
  const [simName, setSimName] = useState('Priya Sharma');
  const [simPhone, setSimPhone] = useState('+91-98765-43210');
  const [simAddress, setSimAddress] = useState('MG Road Metro Station, Downtown');
  const [simSeverity, setSimSeverity] = useState<'critical' | 'high' | 'medium'>('critical');
  const [simIsSilent, setSimIsSilent] = useState(false);
  const [simBattery, setSimBattery] = useState(78);

  // Auto time-elapsed ticker
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSiren = () => {
    if (isSirenOn) {
      audioAlert.stopSiren();
      setIsSirenOn(false);
    } else {
      audioAlert.startSiren();
      setIsSirenOn(true);
    }
  };

  const formatElapsed = (timestampStr: string) => {
    try {
      const created = new Date(timestampStr).getTime();
      const diffSec = Math.max(0, Math.floor((now - created) / 1000));
      const mins = Math.floor(diffSec / 60);
      const secs = diffSec % 60;
      if (mins === 0) return `${secs}s ago`;
      return `${mins}m ${secs < 10 ? '0' : ''}${secs}s ago`;
    } catch {
      return 'just now';
    }
  };

  const handleSimulateSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSimulating(true);
      setSimulationStatus('Broadcasting distress beacon into emergency relay...');

      // Random jitter around downtown coordinates for realistic spatial testing
      const lat = 12.9716 + (Math.random() * 0.016 - 0.008);
      const lng = 77.5946 + (Math.random() * 0.016 - 0.008);

      const res = await fetch('/api/emergencies/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-girl-1',
          userName: simName,
          userPhone: simPhone,
          lat,
          lng,
          address: simAddress,
          accuracy: 6,
          batteryLevel: simBattery,
          severity: simSeverity,
          isSilent: simIsSilent,
          medicalInfo: 'No known allergies. Blood group O+.',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to dispatch simulated SOS');
      }

      setSimulationStatus('Distress alert verified! Nearest precinct alerted.');
      audioAlert.playAlertBeep();
      setTimeout(() => {
        setIsSimulating(false);
        setSimulationStatus(null);
        setShowSimulateModal(false);
        onRefresh();
        if (onTriggerSuccess) onTriggerSuccess();
      }, 700);
    } catch (err: any) {
      console.error('Simulation error', err);
      setSimulationStatus(`Error: ${err.message || 'Failed'}`);
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Radar Control Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start space-x-4">
            {/* Live Radar Pulse Icon */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
              <Radio className="h-7 w-7 animate-pulse" />
              {activeEmergencies.length > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-[9px] font-black text-white items-center justify-center">
                      {activeEmergencies.length}
                    </span>
                  </span>
                </>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
                  <span>Real-Time Trigger Radar</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  SSE Listener: Active (25ms ping)
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white mt-1">
                Distress Signal Surveillance & Auto-Dispatch Monitor
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
                Listens continuously for one-click emergency triggers, silent panic signals, and geofence departures.
                Instant automated routing to parents and the closest response unit.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleToggleSiren}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                isSirenOn
                  ? 'bg-rose-600 text-white animate-pulse hover:bg-rose-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title="Toggle audio alarm for distress triggers"
            >
              {isSirenOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>{isSirenOn ? 'Mute Alert Siren' : 'Enable Audio Siren'}</span>
            </button>

            <button
              onClick={() => setShowSimulateModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              <span>Simulate Distress Trigger</span>
            </button>

            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Refresh radar triggers"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Real-Time Status Ticker Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Distress Beacons</span>
            <span className={`text-base font-black ${activeEmergencies.length > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {activeEmergencies.length > 0 ? `${activeEmergencies.length} ACTIVE ALERTS` : 'ALL SECTORS SECURE'}
            </span>
          </div>
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Dispatch Latency</span>
            <span className="text-base font-black text-indigo-300">0.8 seconds</span>
          </div>
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Police Response SLA</span>
            <span className="text-base font-black text-emerald-300">&lt; 4.5 mins ETA</span>
          </div>
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Automated Parent Calls</span>
            <span className="text-base font-black text-amber-300">Instant (Twilio SMS/Call)</span>
          </div>
        </div>
      </div>

      {/* Incoming Triggers Stream */}
      {activeEmergencies.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span className="flex items-center space-x-1.5 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
              <span>LIVE TRIGGER STREAM ({activeEmergencies.length} ONGOING DISTRESS BEACONS)</span>
            </span>
            <span className="text-slate-400 text-[11px]">Auto-refreshing every 1s</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeEmergencies.map((em) => {
              const elapsed = formatElapsed(em.createdAt || (em as any).triggeredAt || new Date().toISOString());
              return (
                <div
                  key={em.id}
                  className="rounded-2xl border-2 border-rose-500 bg-rose-50/50 p-4 shadow-md hover:shadow-lg transition space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow">
                    {em.isSilent ? 'SILENT PANIC TRIGGER' : 'EMERGENCY SOS TRIGGER'}
                  </div>

                  <div className="flex items-start space-x-3 pr-24">
                    <div className="h-11 w-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                      SOS
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-slate-900">{em.userName}</span>
                        {em.userBloodGroup && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 text-[10px] font-bold">
                            {em.userBloodGroup}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-rose-700 flex items-center space-x-2 mt-0.5">
                        <span>{em.userPhone}</span>
                        <span>•</span>
                        <span className="text-slate-600 font-mono text-[11px] flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{elapsed}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trigger Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-white/90 p-3 rounded-xl border border-rose-200/80 shadow-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Trigger Location</span>
                      <span className="font-semibold text-slate-800 text-[11px] truncate block" title={em.address}>
                        {em.address || 'Street level coordinates'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Battery & Signal</span>
                      <span className="font-semibold text-slate-800 text-[11px] flex items-center space-x-1">
                        <Battery className={`h-3.5 w-3.5 ${em.batteryLevel && em.batteryLevel < 20 ? 'text-rose-600' : 'text-emerald-600'}`} />
                        <span>{em.batteryLevel ?? 82}% · ±{em.accuracyMeters || 8}m GPS</span>
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-indigo-900 font-semibold text-[11px] truncate">
                        <Navigation className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">{em.nearestStationName}</span>
                      </div>
                      <span className="font-black text-indigo-700 text-xs shrink-0 ml-2">
                        ETA ~{em.etaMinutes || 4} min ({em.distanceKm ? em.distanceKm.toFixed(1) : '1.2'} km)
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`tel:${em.userPhone}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Call Victim</span>
                      </a>
                    </div>

                    {onSelectEmergency && (
                      <button
                        onClick={() => onSelectEmergency(em)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                      >
                        Inspect Full Dossier
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center space-y-2">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="text-sm font-black text-slate-800">
            Radar Clear: No Active Distress Triggers in Progress
          </div>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            All registered wards are currently operating in normal safety mode. Click below to simulate an emergency trigger and test the automated dispatch engine.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowSimulateModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simulate SOS Distress Trigger</span>
            </button>
          </div>
        </div>
      )}

      {/* Simulation Modal */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Simulate Emergency Trigger</h4>
                  <p className="text-[11px] text-slate-500">Inject test distress beacon to verify command relay</p>
                </div>
              </div>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateSOS} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ward / Girl Name</label>
                  <input
                    type="text"
                    required
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trigger Location / Sector</label>
                <input
                  type="text"
                  required
                  value={simAddress}
                  onChange={(e) => setSimAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity Level</label>
                  <select
                    value={simSeverity}
                    onChange={(e) => setSimSeverity(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 bg-white"
                  >
                    <option value="critical">Critical (Immediate sirens & dispatch)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Battery Level (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={simBattery}
                    onChange={(e) => setSimBattery(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="simSilent"
                  checked={simIsSilent}
                  onChange={(e) => setSimIsSilent(e.target.checked)}
                  className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                />
                <label htmlFor="simSilent" className="text-xs font-semibold text-slate-700">
                  Silent Distress Beacon (Muted device feedback, high-priority police alert)
                </label>
              </div>

              {simulationStatus && (
                <div className="p-3 rounded-xl bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200 flex items-center space-x-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-rose-600 shrink-0" />
                  <span>{simulationStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition shadow-lg disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>{isSimulating ? 'Injecting Beacon...' : 'Fire Test Trigger Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
