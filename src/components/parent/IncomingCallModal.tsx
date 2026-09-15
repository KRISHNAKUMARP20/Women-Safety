import React, { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, ShieldAlert } from 'lucide-react';
import { Emergency } from '../../types';

interface IncomingCallModalProps {
  isOpen: boolean;
  emergency: Emergency | null;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  emergency,
  onAccept,
  onDecline,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCallStatus('ringing');
      setSeconds(0);
      setHasSpoken(false);
      return;
    }
  }, [isOpen]);

  const handleAccept = () => {
    setCallStatus('connected');
    
    // Play voice immediately on click to bypass strict browser autoplay policies
    if (!hasSpoken && emergency) {
      setHasSpoken(true);
      try {
        if ('speechSynthesis' in window) {
          
          const speakMessages = () => {
            const utteranceEn = new SpeechSynthesisUtterance(
              "your child in danger it is an emergency alert message"
            );
            utteranceEn.rate = 0.9;
            
            const utteranceTa = new SpeechSynthesisUtterance(
              "உங்கள் குழந்தை ஆபத்தில் உள்ளார், இது ஒரு அவசர எச்சரிக்கை செய்தி"
            );
            utteranceTa.lang = 'ta-IN'; 
            utteranceTa.rate = 0.9;

            // Optional: log if there's an error
            utteranceEn.onerror = (e) => console.error("Speech error EN:", e);
            utteranceTa.onerror = (e) => console.error("Speech error TA:", e);

            window.speechSynthesis.speak(utteranceEn);
            window.speechSynthesis.speak(utteranceTa);
          };

          speakMessages();
        } else {
          console.warn('Speech synthesis not supported on this browser');
        }
      } catch (err) {
        console.warn('Speech synthesis failed', err);
      }
    }
    
    onAccept();
  };

  // Call timer when connected
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen || !emergency) return null;

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
      onDecline();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-lg p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-black p-6 sm:p-8 text-white shadow-2xl border border-rose-500/30 text-center">
        
        {/* Top Emergency Indicator */}
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-rose-300 border border-rose-500/40 mb-5">
          <ShieldAlert className="h-3.5 w-3.5 animate-pulse text-rose-400" />
          <span>INCOMING EMERGENCY CALL</span>
        </div>

        {/* Pulsing Avatar */}
        <div className="relative mx-auto my-4 flex h-28 w-28 items-center justify-center">
          {callStatus === 'ringing' && (
            <>
              <div className="absolute inset-0 rounded-full bg-rose-600/30 animate-ping" />
              <div className="absolute -inset-4 rounded-full border border-rose-500/50 animate-pulse" />
            </>
          )}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 text-white shadow-xl shadow-rose-900/50 border-2 border-rose-500">
            <span className="text-4xl">🚨</span>
          </div>
        </div>

        {/* Caller Details */}
        <h3 className="text-2xl font-black text-white tracking-tight mt-4">
          {emergency.userName}
        </h3>
        <p className="text-sm font-semibold text-rose-300 uppercase tracking-widest mt-1">
          SOS Triggered
        </p>

        {/* Call Status */}
        <div className="my-6 h-6">
          {callStatus === 'ringing' && (
            <span className="inline-flex items-center space-x-2 text-sm font-bold text-amber-400 animate-pulse">
              <PhoneIncoming className="h-4 w-4 animate-bounce" />
              <span>Ringing...</span>
            </span>
          )}
          {callStatus === 'connected' && (
            <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-4 py-1 text-sm font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Connected · {formatTimer(seconds)}</span>
            </div>
          )}
          {callStatus === 'ended' && (
            <span className="text-sm font-bold text-rose-400">Call Ended</span>
          )}
        </div>

        {/* Actions */}
        {callStatus === 'ringing' ? (
          <div className="flex items-center justify-center space-x-8 mt-8">
            <button
              onClick={handleEndCall}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 group-hover:bg-rose-700 text-white shadow-xl transition transform active:scale-95">
                <Phone className="h-7 w-7 rotate-[135deg]" />
              </div>
              <span className="text-xs font-bold text-rose-300">Decline</span>
            </button>

            <button
              onClick={handleAccept}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 group-hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 transition transform active:scale-95 animate-bounce">
                <Phone className="h-7 w-7" />
              </div>
              <span className="text-xs font-bold text-emerald-300">Accept</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center mt-8">
            <button
              onClick={handleEndCall}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 group-hover:bg-rose-700 text-white shadow-xl shadow-rose-600/50 transition transform active:scale-95">
                <Phone className="h-7 w-7 rotate-[135deg]" />
              </div>
              <span className="text-xs font-bold text-rose-300">End Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
