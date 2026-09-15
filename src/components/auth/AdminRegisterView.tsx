import React, { useState } from 'react';
import {
  ShieldAlert,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Award,
  Radio,
  Building,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { RoleRegisterViewProps } from './GirlRegisterView';

export const AdminRegisterView: React.FC<RoleRegisterViewProps> = ({
  onSuccess,
  onSwitchToLogin,
  onSwitchRole,
  onCancel,
  className = '',
  showCancelButton = false,
}) => {
  const { register, isLoading: authLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState('Women & Child Safety Cell');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [stationName, setStationName] = useState('Central Police HQ');
  const [clearanceLevel, setClearanceLevel] = useState('Level 3: Central Command Dispatcher');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full officer name.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const generatedEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}.officer@gov.in`;
      const generatedPhone = phone.trim() || '+91-98765-99881';

      await register({
        name: name.trim(),
        email: generatedEmail,
        phone: generatedPhone,
        role: 'admin',
        badgeNumber: badgeNumber.trim() || 'IN-POL-5501',
        policeStationId: 'station-1',
        address: `${stationName} - ${department}`,
        medicalNotes: `Clearance: ${clearanceLevel} | Dept: ${department}`,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Admin/Officer registration failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrefillSample = () => {
    setName('Inspector Anjali Roy');
    setEmail('anjali.roy@police.gov.in');
    setPhone('+91-98765-88776');
    setDepartment('Women & Child Safety Cell');
    setBadgeNumber('MH-WSC-204');
    setStationName('Central Zone Emergency Precinct');
    setClearanceLevel('Level 3: Central Command Dispatcher');
    setPassword('password123');
  };

  return (
    <div
      id="admin-register-card"
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
          <span className="text-emerald-400">Step 1 of 1</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Create Admin / Officer Account</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Register verified precinct officer credentials to coordinate emergency police dispatches and review audits.
        </p>
      </div>

      {/* Quick Sample Fill */}
      <div className="relative z-10 mb-4 flex justify-end">
        <button
          type="button"
          onClick={handlePrefillSample}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 flex items-center space-x-1 transition"
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>Fill Sample Officer</span>
        </button>
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

      {/* Registration Form */}
      <form onSubmit={handleRegisterSubmit} className="relative z-10 space-y-3.5">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Officer Full Legal Name *</label>
          <div className="relative">
            <User className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Inspector Anjali Roy"
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Official Gov / Police Email</label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.name@police.gov.in"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Station Dispatch Contact</label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-98765-88776"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Badge Number & Police Station */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Officer Badge / Station ID</label>
            <div className="relative">
              <Award className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="e.g. MH-WSC-204"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Assigned Station / Precinct</label>
            <div className="relative">
              <Building className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="e.g. Central Zone Emergency HQ"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Department & Clearance Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Department / Division</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
            >
              {[
                'Women & Child Safety Cell',
                'Central 112 Dispatch Command',
                'Metro Rapid Action Patrol',
                'Cyber Incident Response Team',
                'State Emergency Operations Cell',
              ].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Security Clearance</label>
            <select
              value={clearanceLevel}
              onChange={(e) => setClearanceLevel(e.target.value)}
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
            >
              {[
                'Level 1: Field Patrol Officer',
                'Level 2: Station Commander',
                'Level 3: Central Command Dispatcher',
              ].map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Command Authorization Password</label>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
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

        {/* Radio Broadcast Dispatch note */}
        <div className="flex items-center space-x-2 text-[11px] text-purple-300 bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">
          <Radio className="h-4 w-4 shrink-0 text-purple-400" />
          <span>Grants authority to dispatch nearest patrol units to active SOS beacons</span>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          id="btn-admin-register-submit"
          disabled={isSubmitting || authLoading}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-black text-xs py-3 shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Verifying Officer Commission...</span>
            </>
          ) : (
            <>
              <UserCheck className="h-3.5 w-3.5" />
              <span>Register Officer Profile & Access Radar</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="relative z-10 mt-5 pt-4 border-t border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <span>Already commissioned as an officer?</span>
          <button
            type="button"
            id="link-admin-signin"
            onClick={onSwitchToLogin}
            className="font-black text-purple-400 hover:text-purple-300 underline underline-offset-2 transition"
          >
            Sign In
          </button>
        </div>

        {onSwitchRole && (
          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1">
            <span>Register as:</span>
            <button
              type="button"
              onClick={() => onSwitchRole('girl')}
              className="text-rose-400 hover:text-rose-300 font-bold underline transition"
            >
              👧 Girl / Ward
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onSwitchRole('parent')}
              className="text-blue-400 hover:text-blue-300 font-bold underline transition"
            >
              👨‍👩‍👧 Parent
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
