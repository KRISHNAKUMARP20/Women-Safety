import React from 'react';
import {
  ShieldAlert,
  User,
  Radio,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronDown,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenRegister }) => {
  const { currentUser, activeRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    activeEmergencies,
    myActiveEmergency,
    isSirenPlaying,
    toggleSiren,
    isSimulatingLocation,
    toggleSimulation,
  } = useEmergency();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'girl': return 'Girl / Ward';
      case 'parent': return 'Parent';
      case 'police': return 'Police Dispatch';
      case 'admin': return 'Admin Police';
      default: return role;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-md shadow-rose-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  GIRLS SAFETY SYSTEM
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>LIVE SYNC</span>
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                Emergency Dispatch & Live Protective Guardian Network
              </p>
            </div>
          </div>

          {/* Right Action Tools & Dedicated Login */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
              title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Quick Walk Simulator toggle */}
            <button
              onClick={toggleSimulation}
              className={`flex items-center space-x-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition ${
                isSimulatingLocation
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle simulated GPS movement to test live tracking"
            >
              {isSimulatingLocation ? <Pause className="h-3.5 w-3.5 text-amber-600" /> : <Play className="h-3.5 w-3.5 text-slate-500" />}
              <span className="hidden sm:inline">{isSimulatingLocation ? 'Sim Walking' : 'Sim GPS'}</span>
            </button>

            {/* Siren Toggle */}
            <button
              onClick={toggleSiren}
              className={`flex items-center space-x-1 rounded-xl p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold border transition ${
                isSirenPlaying
                  ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={isSirenPlaying ? 'Mute emergency siren' : 'Test emergency audio siren'}
            >
              {isSirenPlaying ? <VolumeX className="h-4 w-4 text-rose-600" /> : <Volume2 className="h-4 w-4" />}
              <span className="hidden md:inline">{isSirenPlaying ? 'Mute Siren' : 'Siren'}</span>
            </button>

            {/* Active SOS indicator */}
            {activeEmergencies.length > 0 && (
              <div className="flex items-center space-x-1.5 rounded-xl bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-bold text-rose-700 animate-pulse">
                <Radio className="h-3.5 w-3.5 text-rose-600" />
                <span>{activeEmergencies.length} SOS</span>
              </div>
            )}

            {/* Current Session Info */}
            {currentUser && (
              <div className="hidden sm:flex items-center space-x-2 pl-1 border-l border-slate-200">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                />
                <div className="text-left text-xs leading-tight">
                  <div className="font-bold text-slate-900 truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{getRoleLabel(activeRole || currentUser.role)}</div>
                </div>
              </div>
            )}

            {/* Separate Login Button - Prominent trigger for dedicated role authentication */}
            {!(currentUser && (currentUser.role === 'girl' || currentUser.role === 'parent')) && onOpenLogin && (
              <button
                type="button"
                id="btn-navbar-login"
                onClick={onOpenLogin}
                className="flex items-center space-x-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold transition shadow-xs"
                title="Open Login portal for Girl, Parent, or Police Command"
              >
                <LogIn className="h-3.5 w-3.5 text-rose-400" />
                <span>Login</span>
              </button>
            )}

            {/* Register button */}
            {!(currentUser && (currentUser.role === 'girl' || currentUser.role === 'parent')) && onOpenRegister && (
              <button
                type="button"
                id="btn-navbar-register"
                onClick={onOpenRegister}
                className="hidden md:flex items-center rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 text-xs font-bold transition"
                title="Create a new account"
              >
                <span>Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
