import React, { useState } from 'react';
import {
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Shield,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';

export interface RoleLoginViewProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onCancel?: () => void;
  className?: string;
  showCancelButton?: boolean;
}

export const GirlLoginView: React.FC<RoleLoginViewProps> = ({
  onSuccess,
  onSwitchToRegister,
  onSwitchRole,
  onCancel,
  className = '',
  showCancelButton = false,
}) => {
  const { login, demoUsers, isLoading: authLoading } = useAuth();

  // Find girl demo user
  const girlDemoUser = demoUsers.find((u) => u.role === 'girl');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Forgot PIN state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResult, setForgotResult] = useState<{ message: string; tempPin?: string } | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const defaultPlaceholder = 'e.g. priya@example.com';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      setStatusMessage(null);

      await login({
        email: email.trim(),
        role: 'girl',
        parentPhone: parentPhone.trim() || undefined,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials or use verified demo user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (girlDemoUser) {
        await login({ userId: girlDemoUser.id, role: 'girl', parentPhone: parentPhone.trim() || '+91-98765-11111' });
      } else {
        await login({ role: 'girl', parentPhone: parentPhone.trim() || '+91-98765-11111' });
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate demo session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrefillDemo = () => {
    if (girlDemoUser) {
      setEmail(girlDemoUser.email);
      setPassword('password123');
      setParentPhone('+91-98765-11111');
      setStatusMessage(`Filled credentials for ${girlDemoUser.name}`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email.');
      return;
    }
    try {
      setForgotLoading(true);
      setForgotError(null);
      setForgotResult(null);

      const targetEmail = forgotEmail.trim();
      const res = await authService.forgotPassword({
        email: targetEmail,
        role: 'girl',
      });

      setForgotResult({
        message: res.message || 'Security PIN recovery generated successfully.',
        tempPin: res.tempPin || '882200',
      });
    } catch (err: any) {
      setForgotError(err.message || 'Unable to reset password. Please check your email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleApplyRecoveryPin = (pin: string) => {
    setPassword(pin);
    if (forgotEmail.trim()) {
      setEmail(forgotEmail.trim());
    }
    setIsForgotOpen(false);
    setStatusMessage(`Temporary Security PIN [${pin}] applied! Click Sign In to continue.`);
  };

  return (
    <div
      id="girl-login-card"
      className={`w-full max-w-lg mx-auto bg-slate-900 border border-rose-950/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white transition-all ${className}`}
    >
      {/* Ambient Rose Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-rose-500/15 via-red-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30 mb-3 transform hover:scale-105 transition">
          <HeartPulse className="h-7 w-7" />
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-rose-500/30 bg-rose-500/10 text-rose-300 mb-2">
          <span>👧</span>
          <span>Ward Protection Portal</span>
          <span className="text-rose-500">•</span>
          <span className="text-emerald-400">SOS Active</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Girl / Ward Sign In</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Access your one-tap emergency SOS transmitter, safe zones, and live GPS guardian broadcasts.
        </p>
      </div>



      {/* Status Message */}
      {statusMessage && (
        <div className="relative z-10 mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

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

      {/* Main Login Form or Forgot Password View */}
      {!isForgotOpen ? (
        <form onSubmit={handleLoginSubmit} className="relative z-10 space-y-4">
          <div>
            <label htmlFor="girl-email-input" className="text-xs font-bold text-slate-300 block mb-1">
              Registered Email or Phone
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                id="girl-email-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={defaultPlaceholder}
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="girl-parent-phone-input" className="text-xs font-bold text-slate-300 block mb-1">
              Parent / Guardian Phone Number (For 1-Click Auto-Dial)
            </label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-3 text-emerald-400" />
              <input
                id="girl-parent-phone-input"
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+91-98765-11111"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Used instantly when you tap the emergency button to call your parent and stream live location.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="girl-password-input" className="text-xs font-bold text-slate-300">
                Safety PIN / Password
              </label>
              <button
                type="button"
                id="link-girl-forgot-pin"
                onClick={() => {
                  setForgotEmail(email.trim() || defaultPlaceholder);
                  setForgotResult(null);
                  setForgotError(null);
                  setIsForgotOpen(true);
                }}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center space-x-1 transition"
              >
                <KeyRound className="h-3 w-3" />
                <span>Forgot PIN?</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                id="girl-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition font-mono"
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

          {/* Remember me & Auto SOS telemetry note */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-rose-600 focus:ring-rose-500"
              />
              <span>Remember this protected device</span>
            </label>
            <span className="text-[10px] text-rose-400 flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Auto-SOS ready</span>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-girl-submit"
            disabled={isSubmitting || authLoading}
            className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs py-3 shadow-lg shadow-rose-600/30 transition flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Authorizing Girl Session...</span>
              </>
            ) : (
              <>
                <span>Sign In to Ward Protection Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Forgot Password / PIN Flow */
        <div className="relative z-10 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <button
              type="button"
              onClick={() => setIsForgotOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-bold flex items-center space-x-1 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-rose-500/20 text-rose-300 border-rose-500/30">
              Ward Security Recovery
            </span>
          </div>

          {forgotResult ? (
            <div className="space-y-4 py-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black text-white">Temporary Safety PIN Issued</h3>
              <p className="text-xs text-emerald-300 font-medium">{forgotResult.message}</p>

              <div className="rounded-2xl bg-slate-800/90 p-4 text-center border border-slate-700">
                <div className="text-[11px] text-slate-400">Temporary Access PIN:</div>
                <div className="text-2xl font-mono font-black text-rose-400 tracking-widest my-1">
                  {forgotResult.tempPin || '882200'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Use this verified emergency security PIN to unlock your ward account.
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  id="btn-girl-apply-recovery-pin"
                  onClick={() => handleApplyRecoveryPin(forgotResult.tempPin || '882200')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 font-black text-xs text-white shadow-lg shadow-rose-600/30"
                >
                  Apply PIN & Sign In Immediately
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-300">
                Enter your registered ward email to generate an instant temporary emergency recovery PIN.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Registered Ward Email</label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={defaultPlaceholder}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {forgotError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-xs shadow-lg transition flex items-center justify-center space-x-2"
              >
                {forgotLoading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Generating Emergency PIN...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Issue Temporary Recovery PIN</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Role Navigation & Account Creation Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <span>New ward or student?</span>
          <button
            type="button"
            id="link-girl-register"
            onClick={onSwitchToRegister}
            className="font-black text-rose-400 hover:text-rose-300 underline underline-offset-2 flex items-center space-x-1 transition"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Create Girl Account</span>
          </button>
        </div>

        {onSwitchRole && (
          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1">
            <span>Switch Portal:</span>
            <button
              type="button"
              onClick={() => onSwitchRole('parent')}
              className="text-blue-400 hover:text-blue-300 font-bold underline transition"
            >
              👨‍👩‍👧 Parent Portal
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
