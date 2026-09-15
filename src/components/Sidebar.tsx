import React from 'react';
import {
  ShieldAlert,
  User,
  PhoneCall,
  Clock,
  Radio,
  MapPin,
  Bell,
  Building,
  Users,
  FileText,
  Activity,
  HeartPulse,
  Settings,
  X,
  Compass,
  CheckCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
}) => {
  const { activeRole, switchRole, currentUser, logout } = useAuth();
  const { activeEmergencies, myActiveEmergency, isFullScreenSOSOpen, setIsFullScreenSOSOpen } = useEmergency();

  const getRoleNavItems = (role: UserRole) => {
    switch (role) {
      case 'girl':
        return [
          { id: 'dashboard', label: 'Safety Dashboard', icon: ShieldAlert },
          { id: 'sos', label: 'Instant SOS Button', icon: Radio, badge: myActiveEmergency ? 'ACTIVE' : undefined },
          { id: 'contacts', label: 'Emergency Contacts', icon: PhoneCall },
          { id: 'history', label: 'Emergency History', icon: Clock },
          { id: 'profile', label: 'Safe Zones & Medical', icon: HeartPulse },
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Guardian Dashboard', icon: Users },
          { id: 'tracking', label: 'Live Location & GPS', icon: MapPin },
          { id: 'alerts', label: 'Emergency Alerts', icon: Bell, badge: activeEmergencies.length > 0 ? `${activeEmergencies.length}` : undefined },
          { id: 'child-profile', label: 'Ward Profile & Vitals', icon: HeartPulse },
        ];
      case 'police':
        return [
          { id: 'dashboard', label: 'Incident Command', icon: Activity },
          { id: 'tracking', label: 'Live Intercept Vectors', icon: Compass },
          { id: 'details', label: 'Patrol Readiness & Log', icon: Building },
          { id: 'response-status', label: 'Dispatch Response Status', icon: CheckCircle },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Command Telemetry', icon: Activity },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'parents', label: 'Guardian Registry', icon: Users },
          { id: 'stations', label: 'Police Stations', icon: Building },
          { id: 'logs', label: 'Emergency Incident Logs', icon: Clock },
          { id: 'reports', label: 'Audit Trail & Export', icon: FileText },
        ];
    }
  };

  const navItems = getRoleNavItems(activeRole);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-sm">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">GIRLS SAFETY</span>
                <span className="block text-[10px] text-slate-400 font-medium">System Navigation</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Active User Card */}
          {currentUser && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="h-10 w-10 rounded-full object-cover border border-white shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-rose-600 font-semibold capitalize">{currentUser.role} Role</p>
              </div>
            </div>
          )}

          {/* Emergency Quick Trigger Banner */}
          {myActiveEmergency && (
            <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-700 flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                  <span>SOS DISPATCHED</span>
                </span>
                <button
                  onClick={() => setIsFullScreenSOSOpen(true)}
                  className="text-[10px] font-bold text-rose-800 bg-white px-2 py-1 rounded-lg border border-rose-300 shadow-xs"
                >
                  EXPAND OVERLAY
                </button>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <div className="mt-6 space-y-1">
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Navigation Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                    isSelected
                      ? 'bg-rose-50 text-rose-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Role Quick-Switching Section */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Role Personas
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {(['girl', 'parent', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    onClose();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left capitalize transition border flex items-center justify-between ${
                    activeRole === r
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>
                    {r === 'girl' ? '👧 Girl (Ward Safety)' : r === 'parent' ? '👨‍👩‍👧 Parent (Guardian)' : '🛡️ Admin (Police Command)'}
                  </span>
                  {activeRole === r && <span className="text-[10px] text-slate-300">Active</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <button
            onClick={() => {
              if (onClose) onClose();
              if (logout) logout();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-slate-200/50 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300 transition-all text-xs font-bold"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out & Register New Profile</span>
          </button>
          
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Girls Safety Net v2.4</span>
            <span className="flex items-center space-x-1 text-emerald-600 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Online</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
