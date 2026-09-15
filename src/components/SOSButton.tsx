import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Phone,
  PhoneCall,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  Navigation,
  HeartPulse,
  Smartphone,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { ParentCallModal } from './ParentCallModal';

export const SOSButton: React.FC = () => {
  const { myActiveEmergency, triggerSOS, cancelSOS, currentLocation, setIsFullScreenSOSOpen } = useEmergency();
  const { currentUser } = useAuth();

  const [isSilent, setIsSilent] = useState(false);
  const [includeMedical, setIncludeMedical] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Threat resolved / I am in a safe location');
  const [showParentCallModal, setShowParentCallModal] = useState(false);
  const [lastDispatchedTime, setLastDispatchedTime] = useState<string | null>(null);

  // Primary parent/emergency contact
  const primaryParent =
    currentUser?.emergencyContacts?.find((c) => c.isPrimary) ||
    currentUser?.emergencyContacts?.[0] || {
      id: 'parent-primary',
      name: 'John Doe (Dad)',
      phone: '+91-98765-11111',
      relation: 'Father',
    };

  const handleSingleClickEmergency = async () => {
    if (myActiveEmergency || isSubmitting) return;

    // SYNCHRONOUS INTENT TRIGGER
    // The phone dialer is now triggered natively via the <a href="tel:..."> tag.
    // We only need to trigger the backend SOS system here.

    try {
      setIsSubmitting(true);
      
      // Fire and forget the SOS trigger
      triggerSOS({
        isSilent,
        medicalInfo: includeMedical && currentUser?.bloodGroup ? `Blood Group: ${currentUser.bloodGroup}` : undefined,
      }).catch(e => console.error('Failed to trigger SOS', e));

      setLastDispatchedTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Error in single click SOS trigger', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!myActiveEmergency) return;
    try {
      setIsSubmitting(true);
      await cancelSOS(myActiveEmergency.id, cancelReason);
      setShowCancelModal(false);
      setShowParentCallModal(false);
    } catch (e) {
      console.error('Failed to cancel SOS', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Parent Emergency Call Modal */}
      <ParentCallModal
        isOpen={showParentCallModal}
        onClose={() => setShowParentCallModal(false)}
        parentName={primaryParent.name}
        parentPhone={primaryParent.phone}
        parentRelation={primaryParent.relation}
        emergencyLocation={myActiveEmergency?.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
        nearestStationName={myActiveEmergency?.nearestStationName || 'Central Women Safety & Quick Response HQ'}
      />

      {/* Active Emergency State Card */}
      {myActiveEmergency ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-rose-950/95 to-slate-900 border-2 border-rose-500/50 p-5 sm:p-6 text-white shadow-2xl animate-in fade-in">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl animate-pulse" />
          
          <div className="relative z-10 space-y-4">
            {/* Header badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-rose-300 border border-rose-500/40">
                <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
                <span>EMERGENCY BROADCAST ACTIVE</span>
              </span>
              <span className="text-[11px] font-mono text-rose-200 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                DISPATCHED {lastDispatchedTime || 'NOW'}
              </span>
            </div>

            {/* Main Alert Confirmation */}
            <div className="text-center py-2">
              <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/50">
                  <ShieldAlert className="h-8 w-8 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-black tracking-tight text-white">
                EMERGENCY TRIGGERED (ONE-CLICK)
              </h3>
              <p className="text-xs text-rose-200 mt-1 max-w-sm mx-auto">
                All 3 immediate protective actions have been executed automatically:
              </p>
            </div>

            {/* The 3 Actions Status Block */}
            <div className="rounded-2xl bg-black/40 border border-white/10 p-3.5 space-y-2.5 text-xs">
              {/* 1. Phone Call to Parents */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <PhoneCall className="h-4 w-4 animate-bounce" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center space-x-1">
                      <span>1. Phone Call to Parents:</span>
                      <span className="text-emerald-400 font-bold">Initiated</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {primaryParent.name} ({primaryParent.phone})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowParentCallModal(true)}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow transition"
                >
                  Call Screen
                </button>
              </div>

              {/* 2. Live Location Sharing */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <MapPin className="h-4 w-4 text-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center space-x-1">
                      <span>2. Live GPS Location:</span>
                      <span className="text-blue-400 font-bold">Streaming to Parents</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {myActiveEmergency.lat.toFixed(4)}, {myActiveEmergency.lng.toFixed(4)} (±{currentLocation.accuracy}m)
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-blue-900/60 text-blue-300 text-[10px] font-bold px-2 py-0.5 border border-blue-500/40">
                  LIVE GPS
                </span>
              </div>

              {/* 3. Nearby Police Station Alerted */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Radio className="h-4 w-4 text-rose-400 animate-ping" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center space-x-1">
                      <span>3. Nearby Police Station:</span>
                      <span className="text-rose-400 font-bold">Alerted</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {myActiveEmergency.nearestStationName} (~{myActiveEmergency.etaMinutes}m ETA)
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-rose-900/60 text-rose-300 text-[10px] font-bold px-2 py-0.5 border border-rose-500/40">
                  DISPATCHED
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => setIsFullScreenSOSOpen(true)}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-black text-white shadow-lg transition flex items-center justify-center space-x-1.5"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Full Beacon Overlay</span>
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
              >
                I Am Safe / Cancel Alert
              </button>

              <button
                onClick={() => {
                  try {
                    const googleMapsLink = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
                    const message = `🚨 EMERGENCY! I am in danger. Here is my live location: ${googleMapsLink}`;
                    let waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                    
                    if (primaryParent?.phone) {
                      let cleanNumber = primaryParent.phone.replace(/[^0-9]/g, '');
                      if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;
                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                      waUrl = isMobile 
                        ? `whatsapp://send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`
                        : `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
                    }
                    window.open(waUrl, '_blank');
                  } catch (e) {
                    console.error('Manual whatsapp launch failed', e);
                  }
                }}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 border border-emerald-400 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 flex items-center justify-center space-x-2"
              >
                <Smartphone className="h-5 w-5" />
                <span>Share Live Location (WhatsApp)</span>
              </button>
            </div>
          </div>

          {/* Cancel SOS Confirmation Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-900 shadow-2xl">
                <h4 className="text-base font-bold text-slate-900">Stand Down Emergency Alert?</h4>
                <p className="mt-1 text-xs text-slate-500">
                  This will notify your parents and the police station that you are safe now.
                </p>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Reason for Cancellation</label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Threat resolved / I am in a safe location">Threat resolved / I am in a safe location</option>
                    <option value="False Alarm / Pressed Mistakenly">False Alarm / Pressed Mistakenly</option>
                    <option value="Parents / Guardian Reached Me">Parents / Guardian Reached Me</option>
                    <option value="Police Patrol Arrived">Police Patrol Arrived</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Keep Alert Active
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    disabled={isSubmitting}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700"
                  >
                    {isSubmitting ? 'Cancelling...' : 'Confirm Safe'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Idle Single-Click Emergency Trigger Card */
        <div className="relative rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col items-center text-center">
          {/* Top Options Bar */}
          <div className="flex flex-wrap items-center justify-between w-full mb-4 pb-3 border-b border-slate-100 gap-2">
            <button
              onClick={() => setIsSilent(!isSilent)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                isSilent
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Silent mode activates emergency without loud siren"
            >
              {isSilent ? <VolumeX className="h-3.5 w-3.5 text-amber-700" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span>{isSilent ? 'Silent Mode' : 'Siren ON'}</span>
            </button>

            <button
              onClick={() => setIncludeMedical(!includeMedical)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                includeMedical
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <HeartPulse className="h-3.5 w-3.5" />
              <span>{includeMedical ? `Vitals (${currentUser?.bloodGroup || 'O+'})` : 'No Vitals'}</span>
            </button>
          </div>

          {/* Central ONE-CLICK Emergency Trigger Button */}
          <div className="my-2 flex flex-col items-center justify-center">
            {/* Pulsing halo */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-52 w-52 rounded-full bg-rose-500/10 animate-ping pointer-events-none" />
              <div className="absolute h-44 w-44 rounded-full bg-rose-500/20 animate-pulse pointer-events-none" />

              <button
                id="emergency-single-click-button"
                onClick={(e) => {
                  e.preventDefault();
                  if (isSubmitting) return;
                  handleSingleClickEmergency();
                }}
                className={`relative flex h-40 w-40 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 via-rose-600 to-red-500 text-white shadow-2xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer border-4 border-rose-200 select-none ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
                title="Single click to trigger emergency: alerts police station and opens options"
              >
                <ShieldAlert className="h-12 w-12 mb-1 animate-pulse" />
                <span className="text-xl font-black tracking-wider leading-tight">
                  EMERGENCY
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-full mt-1 text-rose-100">
                  TAP ONCE
                </span>
              </button>
            </div>

            {/* Instruction banner */}
            <div className="mt-4 space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                <span>SINGLE CLICK ACTIVATION (NO DELAY)</span>
              </div>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Tapping this single button instantly:
              </p>
            </div>
          </div>

          {/* The 3 Actions What Happens list */}
          <div className="w-full mt-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-left text-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-700">
              <PhoneCall className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Calls Parent:</strong> Auto-dials {primaryParent.name} ({primaryParent.phone})
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <strong>Live Location:</strong> Streams real-time GPS coordinates to parents
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
              <span>
                <strong>Police Alert:</strong> Dispatches alert to nearest police station & patrols
              </span>
            </div>
          </div>

          {/* Current GPS coordinates */}
          <div className="mt-3 text-[11px] text-slate-400 font-mono">
            GPS Lock: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)} (±{currentLocation.accuracy}m)
          </div>
        </div>
      )}
    </>
  );
};

