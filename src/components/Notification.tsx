import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, Volume2, VolumeX, CheckCircle, X } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export const NotificationBar: React.FC = () => {
  const { notifications, dismissNotification, isSirenPlaying, toggleSiren, myActiveEmergency } =
    useEmergency();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Critical Siren Top Banner if active */}
      {isSirenPlaying && (
        <div className="sticky top-0 z-50 flex items-center justify-between bg-rose-600 px-4 py-2.5 text-white shadow-md transition-all animate-pulse">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <ShieldAlert className="h-4 w-4 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-rose-800 px-2 py-0.5 rounded mr-2">
                CRITICAL SOS ACTIVE
              </span>
              <span className="text-xs sm:text-sm font-medium">
                {myActiveEmergency
                  ? `Emergency beacon broadcasting for ${myActiveEmergency.userName}!`
                  : 'Emergency siren sounding across safety channels.'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSiren}
              className="flex items-center space-x-1.5 rounded-lg bg-white px-3 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50 transition shadow-sm"
              title="Toggle Siren Sound"
            >
              {isSirenPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span>{isSirenPlaying ? 'Mute Siren' : 'Play Siren'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Notifications Bell */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          aria-label="View Safety Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Drawer Modal */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 sm:w-96 max-h-[460px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col z-50">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Live Dispatch & Alerts ({notifications.length})
                </h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <CheckCircle className="mx-auto h-8 w-8 text-emerald-500/60 mb-2" />
                  All safety systems nominal. No alerts active.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`relative rounded-xl p-3 text-left border text-xs transition ${
                      n.severity === 'high'
                        ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                        : n.severity === 'medium'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`font-semibold tracking-tight ${
                          n.severity === 'high'
                            ? 'text-rose-700'
                            : n.severity === 'medium'
                            ? 'text-amber-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {n.title}
                      </span>
                      <button
                        onClick={() => dismissNotification(n.id)}
                        className="ml-2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{n.message}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="capitalize font-mono px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-600">
                        {n.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const Notification = NotificationBar;
