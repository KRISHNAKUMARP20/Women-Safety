import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Phone,
  PhoneCall,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Minimize2,
  Maximize2,
  Radio,
  Users,
  Car,
  Navigation,
  HeartPulse,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';

export const FullScreenSOSOverlay: React.FC = () => {
  const {
    activeOverlayEmergency,
    myActiveEmergency,
    isFullScreenSOSOpen,
    setIsFullScreenSOSOpen,
    closeEmergencyOverlay,
    cancelSOS,
    isSirenPlaying,
    toggleSiren,
    currentLocation,
  } = useEmergency();

  const { currentUser } = useAuth();

  // Target emergency is either the girl's active emergency or an emergency opened for inspection
  const emergency = activeOverlayEmergency || myActiveEmergency;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Threat resolved / I am in a safe location');
  const [isCancelling, setIsCancelling] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer for how long the SOS has been broadcasting
  useEffect(() => {
    if (!emergency) {
      setElapsedSeconds(0);
      return;
    }
    const startTime = new Date(emergency.createdAt).getTime();
    const updateElapsed = () => {
      const diff = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
      setElapsedSeconds(diff);
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [emergency]);

  // If no emergency is active, or user dismissed/none exists, don't render
  if (!emergency) {
    return null;
  }

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleConfirmCancel = async () => {
    try {
      setIsCancelling(true);
      await cancelSOS(emergency.id, cancelReason);
      setShowCancelModal(false);
    } catch (err) {
      console.error('Failed to cancel SOS', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const isMyEmergency = myActiveEmergency?.id === emergency.id;
  const primaryContact = currentUser?.emergencyContacts?.find((c) => c.isPrimary) || currentUser?.emergencyContacts?.[0];

  // When minimized: Show a high-visibility, sticky floating emergency notification bar
  if (!isFullScreenSOSOpen) {
    return (
      <aside 
        aria-label="Active emergency broadcast status"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-bounce transition-all duration-300"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white p-4 shadow-2xl border-2 border-rose-400/60 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600 shadow-md">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
              <ShieldAlert className="h-6 w-6 animate-pulse text-rose-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md text-rose-100">
                  SOS DISPATCH ACTIVE
                </span>
                <span className="text-[11px] font-mono text-rose-200">
                  {formatElapsed(elapsedSeconds)}
                </span>
              </div>
              <p className="text-xs font-bold text-white mt-0.5">
                Help dispatched ({emergency.nearestStationName}) · ETA ~{emergency.etaMinutes}m
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsFullScreenSOSOpen(true)}
              className="flex items-center space-x-1 rounded-xl bg-white px-3 py-2 text-xs font-black text-rose-700 shadow-lg hover:bg-rose-50 transition"
              title="Expand to high-visibility full-screen SOS overlay"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>EXPAND</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Full-screen high-visibility pulsing animation overlay
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="High-visibility full-screen SOS emergency overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-md text-white flex flex-col justify-between animate-perimeter-strobe"
    >
      {/* Ambient background pulsing radial gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[650px] rounded-full bg-rose-600/20 blur-[130px] animate-pulse" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-[450px] w-[750px] rounded-full bg-red-900/25 blur-[120px]" />
      </div>

      {/* Top Header / Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-rose-300 border border-rose-500/40">
            EMERGENCY BROADCAST ACTIVE
          </span>
          <span className="text-xs font-mono text-rose-200/80 bg-black/40 px-2.5 py-0.5 rounded-lg border border-white/10 hidden sm:inline-block">
            ACTIVE FOR: {formatElapsed(elapsedSeconds)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Siren Toggle */}
          <button
            onClick={toggleSiren}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
              isSirenPlaying
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/50 animate-pulse'
                : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
            }`}
            title="Toggle audible high-decibel deterrent siren"
          >
            {isSirenPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
            <span className="hidden sm:inline">{isSirenPlaying ? 'Mute Siren' : 'Sound Siren'}</span>
          </button>

          {/* Minimize to Floating Bar */}
          <button
            onClick={() => setIsFullScreenSOSOpen(false)}
            className="flex items-center space-x-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 text-xs font-bold border border-white/10 transition"
            title="Minimize to floating banner to inspect map or app"
          >
            <Minimize2 className="h-4 w-4" />
            <span className="hidden sm:inline">Minimize View</span>
          </button>
        </div>
      </header>

      {/* Centerpiece: Concentric Pulsing SOS Beacon & Help Dispatched Feedback */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center text-center">
        
        {/* Animated Sonar Ripple Waves */}
        <div className="relative flex items-center justify-center my-3 sm:my-5">
          {/* Outermost expanding ring */}
          <div className="absolute h-44 w-44 sm:h-56 sm:w-56 rounded-full border-2 border-rose-500/40 bg-rose-500/10 animate-sonar-3 pointer-events-none" />
          {/* Middle expanding ring */}
          <div className="absolute h-36 w-36 sm:h-44 sm:w-44 rounded-full border-2 border-rose-500/60 bg-rose-500/15 animate-sonar-2 pointer-events-none" />
          {/* Inner expanding ring */}
          <div className="absolute h-28 w-28 sm:h-36 sm:w-36 rounded-full border-2 border-rose-400/80 bg-rose-500/20 animate-sonar-1 pointer-events-none" />

          {/* Central Glowing SOS Beacon Button/Icon */}
          <div className="relative flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-red-900 text-white shadow-2xl animate-beacon-glow border-4 border-rose-300">
            <ShieldAlert className="h-14 w-14 sm:h-18 sm:w-18 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Core Status Headlines */}
        <div className="space-y-1.5 mt-2">
          <div className="inline-flex items-center space-x-2 rounded-full bg-rose-500/20 border border-rose-500/50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-rose-300">
            <Radio className="h-3.5 w-3.5 text-rose-400 animate-ping" />
            <span>CRITICAL RESCUE DISPATCH IN PROGRESS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            HELP HAS BEEN DISPATCHED
          </h1>
          <p className="text-sm sm:text-base font-semibold text-rose-200/90 max-w-xl mx-auto">
            Emergency response units and designated guardians have been notified and are vectoring toward your location.
          </p>
        </div>

        {/* 4-Step Visual Dispatch & Intercept Pipeline */}
        <div className="w-full max-w-3xl mt-6 mb-4 rounded-2xl bg-black/40 border border-rose-500/30 p-4 sm:p-5 backdrop-blur-md">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            {/* Step 1 */}
            <div className="flex items-start space-x-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase">1. Broadcast Sent</div>
                <div className="text-[10px] text-slate-300">SOS coordinates transmitted</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase">2. Station Alerted</div>
                <div className="text-[10px] text-slate-300">{emergency.nearestStationName.split(' ')[0]} HQ alerted</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse">
                <Car className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase flex items-center space-x-1">
                  <span>3. Unit En Route</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
                <div className="text-[10px] text-slate-300">Patrol vehicle en route</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-rose-300 uppercase">4. Intercept</div>
                <div className="text-[10px] text-slate-300">ETA ~{emergency.etaMinutes} minutes</div>
              </div>
            </div>
          </div>

          {/* Progress bar visual */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 mt-4 overflow-hidden p-0.5 border border-white/10">
            <div className="bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 h-full rounded-full w-3/4 animate-pulse transition-all duration-500" />
          </div>
        </div>

        {/* Live Dispatch Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl text-left">
          {/* Dispatch Unit Info */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/15 p-3.5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-rose-300 font-bold uppercase tracking-wider mb-1">
              <span className="flex items-center space-x-1">
                <Navigation className="h-3.5 w-3.5 text-rose-400" />
                <span>Dispatched Unit</span>
              </span>
              <span className="bg-rose-900/60 text-rose-200 px-1.5 py-0.5 rounded text-[10px]">
                POLICE RAPID FORCE
              </span>
            </div>
            <div className="text-sm font-bold text-white truncate">
              {emergency.nearestStationName}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {emergency.assignedOfficerName ? (
                <span>Officer: {emergency.assignedOfficerName}</span>
              ) : (
                <span>Sector Patrol Vehicle #4 Vectoring</span>
              )}
            </div>
          </div>

          {/* Dynamic ETA & Distance */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/15 p-3.5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">
              <span className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Estimated Arrival</span>
              </span>
              <span className="bg-amber-900/60 text-amber-200 px-1.5 py-0.5 rounded text-[10px]">
                LIVE VECTOR
              </span>
            </div>
            <div className="text-xl font-black text-amber-300">
              ~{emergency.etaMinutes} MINS
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Approx. {emergency.distanceKm} km from current location
            </div>
          </div>

          {/* Live Telemetry & GPS */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/15 p-3.5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold uppercase tracking-wider mb-1">
              <span className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span>GPS Telemetry</span>
              </span>
              <span className="flex items-center space-x-1 bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>STREAMING</span>
              </span>
            </div>
            <div className="font-mono text-xs font-bold text-white">
              {emergency.lat.toFixed(5)}, {emergency.lng.toFixed(5)}
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              Accuracy: ±{emergency.accuracyMeters || currentLocation.accuracy}m · Encrypted
            </div>
          </div>
        </div>

        {/* Guardian & Medical Disclosed Information */}
        <div className="w-full max-w-3xl mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 bg-black/30 border border-white/10 rounded-xl px-4 py-2">
          <div className="flex items-center space-x-2">
            <Users className="h-3.5 w-3.5 text-purple-400" />
            <span>
              SMS & Live Link sent to <strong>{currentUser?.emergencyContacts?.length || 2} Emergency Guardians</strong>
            </span>
          </div>
          {(emergency.medicalInfo || emergency.userBloodGroup || currentUser?.bloodGroup) && (
            <div className="flex items-center space-x-1.5 text-rose-300 font-semibold">
              <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
              <span>Medical: Blood Group {emergency.medicalInfo || emergency.userBloodGroup || currentUser?.bloodGroup}</span>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Action Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-6 pt-3 space-y-3">
        {/* Direct One-Tap Emergency Helplines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <a
            href="tel:112"
            className="flex items-center justify-center space-x-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-3.5 px-4 shadow-xl border border-rose-400/50 transition active:scale-95"
          >
            <PhoneCall className="h-4 w-4 animate-bounce" />
            <span>CALL 112 (POLICE / MEDICAL)</span>
          </a>

          <a
            href="tel:1091"
            className="flex items-center justify-center space-x-2 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold py-3.5 px-4 shadow-xl border border-purple-400/50 transition active:scale-95"
          >
            <Phone className="h-4 w-4" />
            <span>CALL 1091 (WOMEN HELPLINE)</span>
          </a>

          {primaryContact ? (
            <a
              href={`tel:${primaryContact.phone}`}
              className="flex items-center justify-center space-x-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 shadow-xl border border-white/10 transition active:scale-95 truncate"
            >
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="truncate">CALL {primaryContact.name.toUpperCase()} ({primaryContact.relation})</span>
            </a>
          ) : (
            <button
              onClick={() => setIsFullScreenSOSOpen(false)}
              className="flex items-center justify-center space-x-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 border border-white/10 transition"
            >
              <Navigation className="h-4 w-4 text-blue-400" />
              <span>VIEW INTERCEPT MAP</span>
            </button>
          )}
        </div>

        {/* Safe Stand Down / Cancel Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-white/10">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
            Stay in a well-lit area if possible. Keep your phone unlocked and ready.
          </p>

          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full sm:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-5 py-2 text-xs font-extrabold border border-white/20 transition flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>I AM SAFE / CANCEL SOS</span>
          </button>
        </div>
      </footer>

      {/* Cancel SOS Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 text-white p-6 shadow-2xl border border-slate-700 space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/40">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Stand Down Emergency SOS</h3>
                <p className="text-xs text-slate-400">This will notify police dispatch & guardians that you are safe.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Cancellation Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Threat resolved / I am in a safe location">Threat resolved / I am in a safe location</option>
                <option value="First responders / Police arrived on scene">First responders / Police arrived on scene</option>
                <option value="Family guardian reached me">Family guardian reached me</option>
                <option value="Accidental SOS trigger / False alarm">Accidental SOS trigger / False alarm</option>
                <option value="Test drill / System verification">Test drill / System verification</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Keep SOS Active
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-black shadow-lg flex items-center space-x-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isCancelling ? 'Cancelling...' : 'Confirm I Am Safe'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
