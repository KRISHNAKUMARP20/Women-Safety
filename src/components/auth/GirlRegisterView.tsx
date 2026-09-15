import React, { useState } from 'react';
import {
  HeartPulse,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Activity,
  Shield,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface RoleRegisterViewProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onCancel?: () => void;
  className?: string;
  showCancelButton?: boolean;
}

export const GirlRegisterView: React.FC<RoleRegisterViewProps> = ({
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
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full legal name.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const generatedEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@safetynet.org`;
      const generatedPhone = phone.trim() || '+91-98765-43210';
      
      if (!guardianPhone.trim()) {
        setError('Please enter your Primary Guardian Phone Number so SOS can reach them.');
        setIsSubmitting(false);
        return;
      }

      if (!guardianEmail.trim()) {
        setError('Please enter your Primary Guardian Email so SOS alerts can reach them.');
        setIsSubmitting(false);
        return;
      }

      await register({
        name: name.trim(),
        email: generatedEmail,
        phone: generatedPhone,
        role: 'girl',
        bloodGroup,
        medicalNotes: medicalNotes.trim() || 'No critical allergies documented',
        emergencyContacts: [
          {
            id: 'c-primary',
            name: guardianName.trim() || 'Primary Guardian',
            phone: guardianPhone.trim(),
            email: guardianEmail.trim(),
            relation: 'Parent',
            isPrimary: true,
          },
        ],
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Girl registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrefillSample = () => {
    setName('Ananya Patel');
    setEmail('ananya.patel@safetynet.org');
    setPhone('+91-98765-44332');
    setBloodGroup('B+');
    setMedicalNotes('Mild dust allergy. Carries inhaler.');
    setGuardianName('Vikram Patel');
    setGuardianPhone('+91-98765-11223');
    setGuardianEmail('vikram.patel@example.com');
    setPassword('password123');
  };

  return (
    <div
      id="girl-register-card"
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
          <span>Girl Protection Account</span>
          <span className="text-rose-500">•</span>
          <span className="text-emerald-400">Step 1 of 1</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Create Girl / Ward Account</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Set up your personal SOS distress beacon, medical emergency card, and link your trusted guardian.
        </p>
      </div>

      {/* Quick Sample Fill Pill */}
      <div className="relative z-10 mb-4 flex justify-end">
        <button
          type="button"
          onClick={handlePrefillSample}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 flex items-center space-x-1 transition"
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
          <label className="text-xs font-bold text-slate-300 block mb-1">Full Legal Name *</label>
          <div className="relative">
            <User className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Ward Email</label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@safetynet.org"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Emergency Mobile</label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-98765-43210"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Blood Group & Medical Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full rounded-xl bg-slate-800/90 border border-slate-700 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
            >
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Medical / Allergy Notes <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Activity className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="e.g. Asthma, Penicillin allergy"
                className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Primary Guardian Contact Card */}
        <div className="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-300">
            <Shield className="h-3.5 w-3.5 text-rose-400" />
            <span>Primary Guardian (Emergency Auto-Dialer)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              placeholder="Guardian Name (e.g. Father)"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <input
              type="tel"
              value={guardianPhone}
              onChange={(e) => setGuardianPhone(e.target.value)}
              placeholder="Guardian Phone (+91-...)"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <input
              type="email"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
              placeholder="Guardian Email"
              className="w-full sm:col-span-2 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Password / PIN */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Safety PIN / Password</label>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
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

        {/* Submit button */}
        <button
          type="submit"
          id="btn-girl-register-submit"
          disabled={isSubmitting || authLoading}
          className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs py-3 shadow-lg shadow-rose-600/30 transition flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Registering Ward Safety Profile...</span>
            </>
          ) : (
            <>
              <UserCheck className="h-3.5 w-3.5" />
              <span>Create Girl Profile & Launch Dashboard</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="relative z-10 mt-5 pt-4 border-t border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <span>Already have a girl profile?</span>
          <button
            type="button"
            id="link-girl-signin"
            onClick={onSwitchToLogin}
            className="font-black text-rose-400 hover:text-rose-300 underline underline-offset-2 transition"
          >
            Sign In
          </button>
        </div>

        {onSwitchRole && (
          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1">
            <span>Register as:</span>
            <button
              type="button"
              onClick={() => onSwitchRole('parent')}
              className="text-blue-400 hover:text-blue-300 font-bold underline transition"
            >
              👨‍👩‍👧 Parent
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
