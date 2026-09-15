import React, { useState } from 'react';
import {
  ShieldAlert,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Award,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleLoginViewProps } from './GirlLoginView';

export const AdminLoginView: React.FC<RoleLoginViewProps> = ({
  onSuccess,
  onSwitchToRegister,
  onSwitchRole,
  onCancel,
  className = '',
  showCancelButton = false,
}) => {
  const { login, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);

      await login({
        email: email.trim(),
        password: password,
        role: 'admin',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify officer credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="admin-login-card"
      className={`w-full max-w-lg mx-auto bg-slate-900 border border-purple-950/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white transition-all ${className}`}
    >
      {/* Ambient Purple Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-purple-500/15 via-slate-800/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/30 mb-3 transform hover:scale-105 transition">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-purple-500/30 bg-purple-500/10 text-purple-300 mb-2">
          <span>🛡️</span>
          <span>Police & Admin Command Portal</span>
          <span className="text-purple-500">•</span>
          <span className="text-emerald-400">Clearance Level 3</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Admin & Police Sign In</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Monitor incoming emergency distress alerts, manage patrol dispatch units, and inspect safety audit logs.
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
          <label htmlFor="admin-email-input" className="text-xs font-bold text-slate-300 block mb-1">
            Officer / Admin Gov Email
          </label>
          <div className="relative">
            <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
              id="admin-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. kk6308608@gmail.com"
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="admin-badge-input" className="text-xs font-bold text-slate-300 block mb-1">
              Badge / Station ID <span className="text-slate-500 text-[10px]">(Optional)</span>
            </label>
            <div className="relative">
              <Award className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                id="admin-badge-input"
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="e.g. MH-POL-4412"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password-input" className="text-xs font-bold text-slate-300 block mb-1">
              Command Password
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Remember me & Dispatch station link */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500"
            />
            <span>Remember workstation clearance</span>
          </label>
          <span className="text-[10px] text-purple-400 flex items-center space-x-1">
            <Radio className="h-3 w-3" />
            <span>Precinct radio link active</span>
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-admin-submit"
          disabled={isSubmitting || authLoading}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-black text-xs py-3 shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Validating Command Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Admin & Police Command</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Role Navigation Footer (No Create Account or Forgot Password for Admin) */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <ShieldAlert className="h-3.5 w-3.5 text-purple-400" />
          <span>Officer credentials are managed exclusively by Department HQ</span>
        </div>

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
              onClick={() => onSwitchRole('parent')}
              className="text-blue-400 hover:text-blue-300 font-bold underline transition"
            >
              👨‍👩‍👧 Parent Portal
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

