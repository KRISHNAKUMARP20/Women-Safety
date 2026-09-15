import React, { useState } from 'react';
import {
  Shield,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  RefreshCw,
  MapPin,
  Heart,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { RoleRegisterViewProps } from './GirlRegisterView';

export const ParentRegisterView: React.FC<RoleRegisterViewProps> = ({
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
  const [relation, setRelation] = useState('Father');
  const [wardName, setWardName] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [enableSmsAlerts, setEnableSmsAlerts] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full legal guardian name.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const generatedEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@safetynet.org`;
      const generatedPhone = phone.trim() || '+91-98765-55443';

      await register({
        name: name.trim(),
        email: generatedEmail,
        phone: generatedPhone,
        role: 'parent',
        address: homeAddress.trim() || '404 Metro Heights, Sector 12',
        medicalNotes: wardName.trim() ? `Linked Ward: ${wardName.trim()} (${relation})` : undefined,
        safeZones: [
          {
            id: 'sz-home',
            name: 'Home Sanctuary',
            lat: 19.076,
            lng: 72.8777,
            radiusMeters: 500,
            type: 'home',
          },
        ],
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Guardian registration failed. Please check form fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrefillSample = () => {
    setName('');
    setEmail('');
    setPhone('+91-98765-11223');
    setRelation('Father');
    setWardName('Priya Sharma');
    setHomeAddress('Flat 302, Palm Residency, Mumbai');
    setPassword('password123');
  };

  return (
    <div
      id="parent-register-card"
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
          <span>Guardian Protection Network</span>
          <span className="text-blue-500">•</span>
          <span className="text-emerald-400">Step 1 of 1</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Create Guardian Account</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Link with your daughter's safety system, configure home geofence perimeters, and receive immediate sirens.
        </p>
      </div>

      {/* Quick Sample Fill */}
      <div className="relative z-10 mb-4 flex justify-end">
        <button
          type="button"
          onClick={handlePrefillSample}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 flex items-center space-x-1 transition"
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>Fill Sample Profile</span>
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
          <label className="text-xs font-bold text-slate-300 block mb-1">Guardian Full Name *</label>
          <div className="relative">
            <User className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Guardian Email</label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. parent@example.com"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Guardian Phone (SMS / Calls)</label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-98765-11223"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Linked Ward & Relationship */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Relation to Ward</label>
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            >
              {['Father', 'Mother', 'Legal Guardian', 'Sister', 'Brother', 'Family Relative'].map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Linked Ward / Daughter Name</label>
            <div className="relative">
              <Heart className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Home Safe Zone */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Home Sanctuary Address <span className="text-slate-500 font-normal">(Primary Geofence Safe Zone)</span>
          </label>
          <div className="relative">
            <MapPin className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              placeholder="e.g. Flat 302, Palm Residency, Mumbai"
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Guardian Password</label>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
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

        {/* SMS Siren Alert preference */}
        <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer pt-1 select-none">
          <input
            type="checkbox"
            checked={enableSmsAlerts}
            onChange={(e) => setEnableSmsAlerts(e.target.checked)}
            className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
          />
          <span>Enable instant SMS alerts and loud phone sirens for distress beacons</span>
        </label>

        {/* Submit button */}
        <button
          type="submit"
          id="btn-parent-register-submit"
          disabled={isSubmitting || authLoading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs py-3 shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Registering Guardian Console...</span>
            </>
          ) : (
            <>
              <UserCheck className="h-3.5 w-3.5" />
              <span>Create Guardian Profile & Connect Ward</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="relative z-10 mt-5 pt-4 border-t border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <span>Already registered as a parent?</span>
          <button
            type="button"
            id="link-parent-signin"
            onClick={onSwitchToLogin}
            className="font-black text-blue-400 hover:text-blue-300 underline underline-offset-2 transition"
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
