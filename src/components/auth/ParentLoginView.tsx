import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  MapPin,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleLoginViewProps } from './GirlLoginView';

export const ParentLoginView: React.FC<RoleLoginViewProps> = ({
  onSuccess,
  onSwitchRole,
  onCancel,
  className = '',
  showCancelButton = false,
}) => {
  const { login, demoUsers, isLoading: authLoading } = useAuth();
  
  // Find parent demo user
  const parentDemoUser = demoUsers.find((u) => u.role === 'parent');

  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter the emergency phone number');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);

      await login({
        parentLoginPhone: phone.trim(),
        role: 'parent',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="parent-login-card"
      className={`w-full max-w-lg mx-auto bg-slate-900 border border-blue-950/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white transition-all ${className}`}
    >
      {/* Ambient Blue Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 mb-3 transform hover:scale-105 transition">
          <Shield className="h-7 w-7" />
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-blue-500/30 bg-blue-500/10 text-blue-300 mb-2">
          <span>👨‍👩‍👧</span>
          <span>Guardian & Family Console</span>
          <span className="text-blue-500">•</span>
          <span className="text-emerald-400">Live GPS Link</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Parent / Guardian Sign In</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Monitor your ward's live location, configure geofence safe zones, and receive instant distress notifications.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="relative z-10 mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-200 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleLoginSubmit} className="relative z-10 space-y-4">
        <div>
          <label htmlFor="parent-phone-input" className="text-xs font-bold text-slate-300 block mb-1">
            Emergency Phone Number
          </label>
          <div className="relative">
            <Phone className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
              id="parent-phone-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 1234567890"
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Remember me & safe zone sync */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
            />
            <span>Remember guardian device</span>
          </label>
          <span className="text-[10px] text-blue-400 flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>Ward Geofence sync</span>
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-parent-submit"
          disabled={isSubmitting || authLoading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs py-3 shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Authorizing Guardian Access...</span>
            </>
          ) : (
            <>
              <span>Sign In to Guardian Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Role Navigation Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 text-center space-y-3">
        {onSwitchRole && (
          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1">
            <span>Switch Portal:</span>
            <button
              type="button"
              onClick={() => onSwitchRole('girl')}
              className="text-rose-400 hover:text-rose-300 font-bold underline transition"
            >
              👧 Girl Portal
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onSwitchRole('admin')}
              className="text-purple-400 hover:text-purple-300 font-bold underline transition"
            >
              🛡️ Admin / Police
            </button>
          </div>
        )}

        {showCancelButton && onCancel && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition"
            >
              Return to Safety System
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
