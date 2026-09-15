import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  GirlLoginView,
  ParentLoginView,
  AdminLoginView,
} from '../components/auth';
import { HeartPulse, Shield, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
  onSwitchToRegister: (defaultRole?: UserRole) => void;
  onCancel?: () => void;
  initialRole?: UserRole;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onSwitchToRegister,
  onCancel,
  initialRole = 'girl',
}) => {
  const { activeRole, currentUser } = useAuth();

  // Normalize role: police maps to admin portal
  const normalizedInitial = initialRole === 'police' ? 'admin' : (initialRole as 'girl' | 'parent' | 'admin');
  const [selectedRole, setSelectedRole] = useState<'girl' | 'parent' | 'admin'>(normalizedInitial);

  useEffect(() => {
    if (initialRole) {
      const norm = initialRole === 'police' ? 'admin' : (initialRole as 'girl' | 'parent' | 'admin');
      setSelectedRole(norm);
    }
  }, [initialRole]);

  const handleRoleChange = (newRole: UserRole) => {
    const norm = newRole === 'police' ? 'admin' : (newRole as 'girl' | 'parent' | 'admin');
    setSelectedRole(norm);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-white relative">
      <div className="w-full max-w-lg space-y-4">
        {/* Role Portal Selection Tabs */}
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
            Separate Role Login Portals:
          </span>
          {currentUser && (
            <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Current: {currentUser.name} ({activeRole})</span>
            </span>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Login Role Portals"
          className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg"
        >
          {/* Girl Tab */}
          <button
            id="tab-login-girl"
            role="tab"
            aria-selected={selectedRole === 'girl'}
            type="button"
            onClick={() => setSelectedRole('girl')}
            className={`py-2.5 px-2 rounded-xl text-center transition-all duration-200 flex flex-col items-center justify-center space-y-1 ${
              selectedRole === 'girl'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold border border-rose-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <HeartPulse className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">Girl / Ward</span>
            </div>
            <span className="text-[9px] opacity-80">SOS & GPS</span>
          </button>

          {/* Parent Tab */}
          <button
            id="tab-login-parent"
            role="tab"
            aria-selected={selectedRole === 'parent'}
            type="button"
            onClick={() => setSelectedRole('parent')}
            className={`py-2.5 px-2 rounded-xl text-center transition-all duration-200 flex flex-col items-center justify-center space-y-1 ${
              selectedRole === 'parent'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold border border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Shield className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">Parent</span>
            </div>
            <span className="text-[9px] opacity-80">Live Tracking</span>
          </button>

          {/* Admin / Police Tab */}
          <button
            id="tab-login-admin"
            role="tab"
            aria-selected={selectedRole === 'admin'}
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2.5 px-2 rounded-xl text-center transition-all duration-200 flex flex-col items-center justify-center space-y-1 ${
              selectedRole === 'admin'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold border border-purple-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">Police / Admin</span>
            </div>
            <span className="text-[9px] opacity-80">Police Command</span>
          </button>
        </div>

        {/* Dedicated Individual Role Login Views */}
        <div className="transition-all duration-300">
          {selectedRole === 'girl' && (
            <GirlLoginView
              onSuccess={onSuccess}
              onSwitchToRegister={() => onSwitchToRegister('girl')}
              onSwitchRole={handleRoleChange}
              onCancel={onCancel}
              showCancelButton={Boolean(onCancel)}
            />
          )}

          {selectedRole === 'parent' && (
            <ParentLoginView
              onSuccess={onSuccess}
              onSwitchToRegister={() => onSwitchToRegister('parent')}
              onSwitchRole={handleRoleChange}
              onCancel={onCancel}
              showCancelButton={Boolean(onCancel)}
            />
          )}

          {selectedRole === 'admin' && (
            <AdminLoginView
              onSuccess={onSuccess}
              onSwitchToRegister={() => onSwitchToRegister('admin')}
              onSwitchRole={handleRoleChange}
              onCancel={onCancel}
              showCancelButton={Boolean(onCancel)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
