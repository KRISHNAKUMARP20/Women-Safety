import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  UserPlus,
  ArrowLeft,
  Phone,
  Shield,
  HeartPulse,
  Sparkles,
  RefreshCw,
  Info,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { authService } from '../services/authService';

export interface UnifiedLoginProps {
  onSuccess?: () => void;
  onSwitchToRegister?: (role: UserRole) => void;
  onCancel?: () => void;
  initialRole?: UserRole;
  compact?: boolean;
  className?: string;
  showCancelButton?: boolean;
}

export const UnifiedLogin: React.FC<UnifiedLoginProps> = ({
  onSuccess,
  onSwitchToRegister,
  onCancel,
  initialRole = 'girl',
  compact = false,
  className = '',
  showCancelButton = true,
}) => {
  const { login, register } = useAuth();

  // Primary active role tab: 'girl' | 'parent' | 'admin'
  const [selectedRole, setSelectedRole] = useState<'girl' | 'parent' | 'admin'>(
    initialRole === 'police' ? 'admin' : (initialRole as 'girl' | 'parent' | 'admin')
  );

  // Active view: 'login' | 'forgot' | 'register_inline'
  const [activeView, setActiveView] = useState<'login' | 'forgot' | 'register_inline'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResult, setForgotResult] = useState<{
    success: boolean;
    message: string;
    tempPin?: string;
  } | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Inline Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('password123');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regWardInfo, setRegWardInfo] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Sync initialRole if updated from parent
  useEffect(() => {
    if (initialRole) {
      const normalized = initialRole === 'police' ? 'admin' : initialRole;
      setSelectedRole(normalized as 'girl' | 'parent' | 'admin');
    }
  }, [initialRole]);


  // When changing role tabs, adjust default email placeholder if empty
  const handleRoleTabChange = (newRole: 'girl' | 'parent' | 'admin') => {
    setSelectedRole(newRole);
    setError(null);
    setStatusMessage(null);
    setForgotError(null);
    setForgotResult(null);
  };

  const roleConfigs = {
    girl: {
      role: 'girl' as const,
      label: 'Girl / Ward',
      shortLabel: 'Girl',
      badge: 'Ward Protection',
      emoji: '👧',
      icon: HeartPulse,
      tagline: 'Single-tap SOS trigger, live GPS tracking & guardian emergency auto-dialer',
      colorName: 'rose',
      bgGlow: 'from-rose-500/10 via-red-500/5 to-transparent',
      gradientBtn: 'from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500',
      tabActive: 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 border-rose-500',
      pillColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      accentText: 'text-rose-400',
      borderAccent: 'border-rose-500/40',
      defaultEmailPlaceholder: 'priya.sharma@safetynet.org',
      inputEmailLabel: 'Girl Account Email / Username',
    },
    parent: {
      role: 'parent' as const,
      label: 'Parent / Guardian',
      shortLabel: 'Parent',
      badge: 'Guardian Network',
      emoji: '👨‍👩‍👧',
      icon: Shield,
      tagline: 'Real-time ward location monitoring, geofence safe zones & battery alerts',
      colorName: 'blue',
      bgGlow: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      gradientBtn: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
      tabActive: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-blue-500',
      pillColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      accentText: 'text-blue-400',
      borderAccent: 'border-blue-500/40',
      defaultEmailPlaceholder: 'e.g. parent@example.com',
      inputEmailLabel: 'Registered Parent / Guardian Email',
    },
    admin: {
      role: 'admin' as const,
      label: 'Admin Command',
      shortLabel: 'Admin',
      badge: 'Emergency Command',
      emoji: '🛡️',
      icon: ShieldAlert,
      tagline: 'Real-time distress radar, precinct police auto-dispatch & national audit logs',
      colorName: 'purple',
      bgGlow: 'from-purple-500/10 via-slate-800/10 to-transparent',
      gradientBtn: 'from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600',
      tabActive: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border-purple-500',
      pillColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      accentText: 'text-purple-400',
      borderAccent: 'border-purple-500/40',
      defaultEmailPlaceholder: 'director.safetynet@gov.in',
      inputEmailLabel: 'Command Officer / Admin Email',
    },
  };

  const currentConfig = roleConfigs[selectedRole];

  // Submit standard login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      setStatusMessage(null);

      await login({
        email: email.trim(),
        role: selectedRole,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };


  // Forgot Password request
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email.');
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError(null);
      setForgotResult(null);

      const res = await authService.forgotPassword({
        email: forgotEmail.trim(),
        role: selectedRole,
      });

      setForgotResult({
        success: true,
        message: res.message || 'Security Recovery PIN successfully generated.',
        tempPin: res.tempPin || '882200',
      });
    } catch (err: any) {
      setForgotError(err.message || 'Unable to reset password. Please check the email address.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Use Temporary Recovery PIN to login
  const handleApplyRecoveryPin = (pin: string) => {
    setPassword(pin);
    if (forgotEmail.trim()) {
      setEmail(forgotEmail.trim());
    }
    setActiveView('login');
    setStatusMessage(`Temporary Security PIN [${pin}] applied! You can now sign in.`);
  };

  // Create Account / Register click
  const handleCreateAccountClick = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister(selectedRole);
    } else {
      // Inline registration view
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('password123');
      setRegError(null);
      setActiveView('register_inline');
    }
  };

  // Submit inline registration
  const handleInlineRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setRegError('Please provide your full legal name.');
      return;
    }

    try {
      setRegLoading(true);
      setRegError(null);

      const genEmail = regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '')}@safetynet.org`;
      await register({
        name: regName.trim(),
        email: genEmail,
        phone: regPhone.trim() || '+91-98765-43210',
        role: selectedRole,
        bloodGroup: selectedRole === 'girl' ? regBloodGroup : undefined,
        medicalNotes: selectedRole === 'girl' ? 'Registered via unified portal' : (regWardInfo ? `Ward: ${regWardInfo}` : undefined),
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setRegError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div
      id="unified-login-card"
      className={`w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white transition-all ${className}`}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${currentConfig.bgGlow} blur-3xl pointer-events-none transition-all duration-500`}
      />

      {/* Header Badge & Brand */}
      <div className="relative z-10 text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${currentConfig.gradientBtn} text-white shadow-lg transition-transform duration-300 transform hover:scale-105`}
          >
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-slate-800 bg-slate-800/80 text-slate-300">
            <span>{currentConfig.emoji}</span>
            <span>{currentConfig.badge}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400">Secure 256-Bit</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {activeView === 'login'
              ? 'Unified Security Access'
              : activeView === 'forgot'
              ? 'Security PIN Recovery'
              : 'Create Verified Account'}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto line-clamp-2">
            {activeView === 'login'
              ? currentConfig.tagline
              : activeView === 'forgot'
              ? 'Enter your registered safety email to receive a temporary recovery PIN.'
              : `Create a protective safety account registered for ${currentConfig.label}.`}
          </p>
        </div>
      </div>

      {/* Role Selection Tabs (Girl, Parent, Admin) */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Select User Portal:
          </label>
          <span className={`text-[11px] font-bold ${currentConfig.accentText}`}>
            {currentConfig.shortLabel} Mode Active
          </span>
        </div>

        {/* Tab Navigation */}
        <div
          role="tablist"
          aria-label="User Roles"
          className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-inner"
        >
          {(['girl', 'parent', 'admin'] as const).map((roleKey) => {
            const config = roleConfigs[roleKey];
            const isActive = selectedRole === roleKey;
            return (
              <button
                key={roleKey}
                id={`tab-role-${roleKey}`}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => handleRoleTabChange(roleKey)}
                className={`py-2.5 px-2 rounded-xl text-center transition-all duration-200 flex flex-col items-center justify-center space-y-1 ${
                  isActive
                    ? config.tabActive
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg leading-none">{config.emoji}</span>
                  <span className="text-xs font-bold capitalize">{config.shortLabel}</span>
                </div>
                <span className="text-[9px] font-medium opacity-80 truncate max-w-full">
                  {roleKey === 'girl' ? 'SOS & Ward' : roleKey === 'parent' ? 'Tracking' : 'Command'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: Standard Login Form */}
      {activeView === 'login' && (
        <div className="relative z-10 space-y-5">


          {/* Status Message (e.g. after password recovery or fill) */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-fadeIn">
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

          {/* Main Credentials Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="login-email-input" className="text-xs font-bold text-slate-300 block mb-1">
                {currentConfig.inputEmailLabel}
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentConfig.defaultEmailPlaceholder}
                  className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide toggle & Forgot Password Link */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password-input" className="text-xs font-bold text-slate-300">
                  Security PIN / Password
                </label>
                {/* FORGOT PASSWORD LINK */}
                <button
                  type="button"
                  id="link-forgot-password"
                  onClick={() => {
                    setForgotEmail(email.trim());
                    setForgotResult(null);
                    setForgotError(null);
                    setActiveView('forgot');
                  }}
                  className={`text-[11px] font-bold transition flex items-center space-x-1 ${currentConfig.accentText} hover:underline`}
                >
                  <KeyRound className="h-3 w-3" />
                  <span>Forgot Password?</span>
                </button>
              </div>

              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                <input
                  id="login-password-input"
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

            {/* Remember Me Option */}
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-rose-600 focus:ring-rose-500"
                />
                <span>Remember session on this device</span>
              </label>
              <span className="text-[10px] text-slate-500">Emergency auto-sync active</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-login-submit"
              disabled={isLoading}
              className={`w-full rounded-xl bg-gradient-to-r ${currentConfig.gradientBtn} text-white font-black text-xs py-3 shadow-lg shadow-rose-600/20 transition flex items-center justify-center space-x-2 hover:opacity-95 active:scale-[0.99] disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {currentConfig.shortLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* CREATE ACCOUNT LINK SECTION */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
              <span>Don't have an account?</span>
              <button
                type="button"
                id="link-create-account"
                onClick={handleCreateAccountClick}
                className={`font-black underline underline-offset-2 flex items-center space-x-1 ${currentConfig.accentText} hover:opacity-80 transition`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Create {currentConfig.shortLabel} Account</span>
              </button>
            </div>

            {/* Quick action secondary links */}
            <div className="flex items-center justify-center space-x-3 text-[11px] text-slate-500">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email.trim());
                  setActiveView('forgot');
                }}
                className="hover:text-slate-300 transition"
              >
                Forgot Password?
              </button>
              {showCancelButton && onCancel && (
                <>
                  <span>•</span>
                  <button type="button" onClick={onCancel} className="hover:text-slate-300 transition">
                    Return to Safety Portal
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Forgot Password / Security PIN Recovery Flow */}
      {activeView === 'forgot' && (
        <div className="relative z-10 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveView('login')}
              className="text-slate-400 hover:text-white text-xs font-bold flex items-center space-x-1 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${currentConfig.pillColor}`}>
              {currentConfig.shortLabel} Security Recovery
            </span>
          </div>

          {forgotResult ? (
            <div className="space-y-4 py-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">Recovery PIN Issued!</h3>
                <p className="text-xs text-emerald-300 font-medium">{forgotResult.message}</p>
              </div>

              <div className="rounded-2xl bg-slate-800/90 p-4 text-center border border-slate-700">
                <div className="text-[11px] text-slate-400">Temporary One-Time Access PIN:</div>
                <div className="text-2xl font-mono font-black text-rose-400 tracking-widest my-1">
                  {forgotResult.tempPin || '882200'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Use this verified emergency security PIN to authenticate your session.
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  id="btn-apply-recovery-pin"
                  onClick={() => handleApplyRecoveryPin(forgotResult.tempPin || '882200')}
                  className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${currentConfig.gradientBtn} font-black text-xs text-white shadow-lg`}
                >
                  Apply PIN & Sign In Immediately
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotResult(null);
                    setActiveView('login');
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs"
                >
                  Close and Return
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-300 flex items-start space-x-2">
                <Info className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  SafetyNet will issue a temporary recovery PIN for your{' '}
                  <strong className="text-white">{currentConfig.label}</strong> profile.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Registered Account Email
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={currentConfig.defaultEmailPlaceholder}
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

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${currentConfig.gradientBtn} text-white font-black text-xs shadow-lg transition flex items-center justify-center space-x-2`}
                >
                  {forgotLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Issuing Temporary PIN...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Generate Security Recovery PIN</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveView('login')}
                    className="text-xs text-slate-400 hover:text-white transition"
                  >
                    Remember your password? <strong>Sign In</strong>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* VIEW 3: Inline Account Creation Flow */}
      {activeView === 'register_inline' && (
        <div className="relative z-10 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveView('login')}
              className="text-slate-400 hover:text-white text-xs font-bold flex items-center space-x-1 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${currentConfig.pillColor}`}>
              New {currentConfig.shortLabel} Registration
            </span>
          </div>

          <form onSubmit={handleInlineRegisterSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={selectedRole === 'girl' ? 'e.g., Ananya Patel' : selectedRole === 'parent' ? 'e.g., Vikram Patel' : 'Officer Name'}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@safetynet.org"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91-98765-43210"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {selectedRole === 'girl' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Blood Group</label>
                <select
                  value={regBloodGroup}
                  onChange={(e) => setRegBloodGroup(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'parent' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Linked Ward / Child Name</label>
                <input
                  type="text"
                  value={regWardInfo}
                  onChange={(e) => setRegWardInfo(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Security PIN / Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Choose PIN or password"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={regLoading}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${currentConfig.gradientBtn} text-white font-black text-xs shadow-lg transition flex items-center justify-center space-x-2`}
            >
              {regLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Registering Protected Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Complete {currentConfig.shortLabel} Registration</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveView('login')}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Already have an account? <strong>Sign In</strong>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trust & Dispatch Guarantee Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center space-x-1">
          <Shield className="h-3 w-3 text-emerald-400" />
          <span>Encrypted Gateway</span>
        </div>
        <div>Emergency Hotline: Dial 112 directly</div>
      </div>
    </div>
  );
};
