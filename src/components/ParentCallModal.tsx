import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, ShieldAlert, MapPin, CheckCircle2 } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

interface ParentCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentName: string;
  parentPhone: string;
  parentRelation?: string;
  emergencyLocation?: string;
  nearestStationName?: string;
}

export const ParentCallModal: React.FC<ParentCallModalProps> = ({
  isOpen,
  onClose,
  parentName,
  parentPhone,
  parentRelation = 'Parent / Guardian',
  emergencyLocation = 'Market St & 5th St',
  nearestStationName = 'Central Women Safety HQ',
}) => {
  const [callStatus, setCallStatus] = useState<'dialing' | 'ringing' | 'connected' | 'ended'>('dialing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize call sequence
  useEffect(() => {
    if (!isOpen) {
      setCallStatus('dialing');
      setSeconds(0);
      return;
    }

    // Play synthesized voice alert if supported
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `Emergency call connecting to ${parentName}. Live location and police dispatch alert transmitted.`
        );
        utterance.rate = 1.05;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.warn('Speech synthesis not available', err);
    }

    // Dialing -> Ringing after 1.2s
    const ringTimer = setTimeout(() => {
      setCallStatus('ringing');
    }, 1200);

    // Ringing -> Connected after 3.2s
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 3200);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(connectTimer);
    };
  }, [isOpen, parentName]);

  // Call timer when connected
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleNativeDial = () => {
    window.location.href = `tel:${parentPhone.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Emergency call to parent"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-7 text-white shadow-2xl border border-slate-700/80 text-center">
        {/* Top Emergency Indicator */}
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-rose-300 border border-rose-500/40 mb-5">
          <ShieldAlert className="h-3.5 w-3.5 animate-pulse text-rose-400" />
          <span>EMERGENCY PARENT LINE</span>
        </div>

        {/* Parent Avatar / Pulsing Icon */}
        <div className="relative mx-auto my-3 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-600/30 animate-ping" />
          <div className="absolute -inset-2 rounded-full border border-rose-500/50 animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-xl shadow-rose-600/40">
            <Phone className="h-9 w-9 text-white animate-bounce" />
          </div>
        </div>

        {/* Parent Details */}
        <h3 className="text-xl font-black text-white tracking-tight mt-3">
          {parentName}
        </h3>
        <p className="text-xs font-semibold text-rose-300 capitalize">{parentRelation}</p>
        <p className="text-sm font-mono text-slate-300 mt-1">{parentPhone}</p>

        {/* Call Status Badge */}
        <div className="my-4">
          {callStatus === 'dialing' && (
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-400 animate-pulse">
              <span>Dialing parent...</span>
            </span>
          )}
          {callStatus === 'ringing' && (
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>Ringing {parentName}'s phone...</span>
            </span>
          )}
          {callStatus === 'connected' && (
            <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Connected · {formatTimer(seconds)}</span>
            </div>
          )}
          {callStatus === 'ended' && (
            <span className="text-xs font-bold text-rose-400">Call Ended</span>
          )}
        </div>

        {/* Real-time sync disclosures */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-3.5 text-left text-xs space-y-2 mb-6">
          <div className="flex items-start space-x-2 text-slate-300">
            <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Live Location Shared:</span>
              <p className="text-[11px] text-slate-400 leading-snug">{emergencyLocation}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2 text-slate-300 border-t border-white/5 pt-2">
            <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Police Alerted:</span>
              <p className="text-[11px] text-slate-400 leading-snug">{nearestStationName} dispatch notified</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
              isMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/50 transition transform active:scale-95"
            title="End Call"
          >
            <PhoneOff className="h-7 w-7" />
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
              isSpeaker
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isSpeaker ? 'Speaker on' : 'Speaker off'}
          >
            {isSpeaker ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>

        {/* Native phone dialer fallback button */}
        <button
          onClick={handleNativeDial}
          className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 py-2.5 px-3 text-xs font-bold text-slate-200 transition flex items-center justify-center space-x-1.5"
        >
          <Phone className="h-3.5 w-3.5 text-emerald-400" />
          <span>Open in Phone App ({parentPhone})</span>
        </button>
      </div>
    </div>
  );
};
