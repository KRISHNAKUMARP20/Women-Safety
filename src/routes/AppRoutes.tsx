import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Notification } from '../components/Notification';
// Landing, Login, Register Pages
import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// Girl Pages
import { GirlDashboard } from '../pages/girl/GirlDashboard';
import { SOSPage } from '../pages/girl/SOSPage';
import { EmergencyContacts } from '../pages/girl/EmergencyContacts';
import { EmergencyHistory } from '../pages/girl/EmergencyHistory';
import { Profile } from '../pages/girl/Profile';

// Parent Pages
import { ParentDashboard } from '../pages/parent/ParentDashboard';
import { LiveLocation } from '../pages/parent/LiveLocation';
import { EmergencyAlerts as ParentEmergencyAlerts } from '../pages/parent/EmergencyAlerts';
import { ChildProfile } from '../pages/parent/ChildProfile';

// Police Pages
import { PoliceDashboard } from '../pages/police/PoliceDashboard';
import { LiveTracking } from '../pages/police/LiveTracking';
import { EmergencyDetails } from '../pages/police/EmergencyDetails';
import { PoliceEmergencyAlerts } from '../pages/police/EmergencyAlerts';
import { ResponseStatus } from '../pages/police/ResponseStatus';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { Users } from '../pages/admin/Users';
import { Parents } from '../pages/admin/Parents';
import { PoliceStations } from '../pages/admin/PoliceStations';
import { EmergencyLogs } from '../pages/admin/EmergencyLogs';
import { Reports } from '../pages/admin/Reports';

import {
  Menu,
  Maximize2,
  Volume2,
  VolumeX,
  Radio,
  Home,
  MapPin,
  HeartPulse,
  Phone,
  Clock,
  Building,
  CheckCircle,
  FileText,
  Users as UsersIcon,
  Bell,
  Activity,
} from 'lucide-react';
import { UserRole } from '../types';

export const AppRoutes: React.FC = () => {
  const { activeRole, switchRole, currentUser } = useAuth();
  const {
    activeEmergencies,
    myActiveEmergency,
    isSirenPlaying,
    toggleSiren,
  } = useEmergency();

  // Root view: 'app' | 'landing' | 'login' | 'register' (default changed to 'landing' for home page)
  const [currentRoute, setCurrentRoute] = useState<'app' | 'landing' | 'login' | 'register'>('landing');
  const [authRoleSelection, setAuthRoleSelection] = useState<UserRole>('girl');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Subtabs for each role
  const [girlTab, setGirlTab] = useState<'dashboard' | 'sos' | 'contacts' | 'history' | 'profile'>('dashboard');
  const [parentTab, setParentTab] = useState<'dashboard' | 'live' | 'alerts' | 'child-profile'>('dashboard');
  const [policeTab, setPoliceTab] = useState<'dashboard' | 'tracking' | 'details' | 'alerts' | 'response-status'>('dashboard');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'parents' | 'stations' | 'logs' | 'reports'>('dashboard');

  const handleOpenLoginWithRole = (roleToOpen?: UserRole) => {
    if (roleToOpen) setAuthRoleSelection(roleToOpen);
    else if (activeRole) setAuthRoleSelection(activeRole);
    setCurrentRoute('login');
  };

  const handleOpenRegisterWithRole = (roleToOpen?: UserRole) => {
    if (roleToOpen) setAuthRoleSelection(roleToOpen);
    else if (activeRole) setAuthRoleSelection(activeRole);
    setCurrentRoute('register');
  };

  // Handle route navigation
  if (currentRoute === 'landing') {
    return (
      <LandingPage
        onEnterApp={(role) => {
          if (role) switchRole(role);
          setCurrentRoute('app');
        }}
        onOpenLogin={() => handleOpenLoginWithRole(activeRole)}
        onOpenRegister={() => handleOpenRegisterWithRole(activeRole)}
      />
    );
  }

  if (currentRoute === 'login') {
    return (
      <Login
        initialRole={authRoleSelection}
        onSuccess={() => setCurrentRoute('app')}
        onSwitchToRegister={(targetRole) => handleOpenRegisterWithRole(targetRole || authRoleSelection)}
        onCancel={() => setCurrentRoute('app')}
      />
    );
  }

  if (currentRoute === 'register') {
    return (
      <Register
        initialRole={authRoleSelection}
        onSuccess={() => setCurrentRoute('app')}
        onSwitchToLogin={(targetRole) => handleOpenLoginWithRole(targetRole || authRoleSelection)}
        onCancel={() => setCurrentRoute('app')}
      />
    );
  }

  // Get active tab identifier for sidebar
  const getActiveTab = () => {
    switch (activeRole) {
      case 'girl': return girlTab;
      case 'parent': return parentTab === 'live' ? 'tracking' : parentTab;
      case 'police': return policeTab;
      case 'admin': return adminTab;
    }
  };

  const handleSelectTab = (tabId: string) => {
    switch (activeRole) {
      case 'girl':
        setGirlTab(tabId as any);
        break;
      case 'parent':
        setParentTab(tabId === 'tracking' ? 'live' : (tabId as any));
        break;
      case 'police':
        setPoliceTab(tabId as any);
        break;
      case 'admin':
        setAdminTab(tabId as any);
        break;
    }
  };

  // Render role sub navigation bar
  const renderSubNav = () => {
    switch (activeRole) {
      case 'girl':
        return (
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setGirlTab('dashboard')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                girlTab === 'dashboard'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Safety Dashboard</span>
            </button>
            <button
              onClick={() => setGirlTab('sos')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                girlTab === 'sos'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>SOS Beacon</span>
              {myActiveEmergency && (
                <span className="h-2 w-2 rounded-full bg-rose-300 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setGirlTab('contacts')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                girlTab === 'contacts'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Emergency Contacts</span>
            </button>
            <button
              onClick={() => setGirlTab('history')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                girlTab === 'history'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>SOS History</span>
            </button>
            <button
              onClick={() => setGirlTab('profile')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                girlTab === 'profile'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HeartPulse className="h-3.5 w-3.5" />
              <span>Safe Zones & Medical</span>
            </button>
          </div>
        );

      case 'parent':
        return (
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setParentTab('dashboard')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                parentTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Guardian Overview</span>
            </button>
            <button
              onClick={() => setParentTab('live')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                parentTab === 'live'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Live Location & Safe Zones</span>
            </button>
            <button
              onClick={() => setParentTab('alerts')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                parentTab === 'alerts'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Emergency Alerts</span>
              {activeEmergencies.length > 0 && (
                <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] text-white">
                  {activeEmergencies.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setParentTab('child-profile')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                parentTab === 'child-profile'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HeartPulse className="h-3.5 w-3.5" />
              <span>Ward Medical & Geofence</span>
            </button>
          </div>
        );

      case 'police':
        return (
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setPoliceTab('dashboard')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                policeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Police Dispatch</span>
            </button>
            <button
              onClick={() => setPoliceTab('tracking')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                policeTab === 'tracking'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Live Intercept Tracking</span>
            </button>
            <button
              onClick={() => setPoliceTab('alerts')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                policeTab === 'alerts'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>Distress Alert Stream</span>
              {activeEmergencies.length > 0 && (
                <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] text-white animate-pulse">
                  {activeEmergencies.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setPoliceTab('response-status')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                policeTab === 'response-status'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Response Status Tracking</span>
            </button>
            <button
              onClick={() => setPoliceTab('details')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                policeTab === 'details'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Building className="h-3.5 w-3.5" />
              <span>Station Details & Readiness</span>
            </button>
          </div>
        );

      case 'admin':
        return (
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setAdminTab('dashboard')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                adminTab === 'dashboard'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Admin Telemetry</span>
            </button>
            <button
              onClick={() => setAdminTab('users')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                adminTab === 'users'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <UsersIcon className="h-3.5 w-3.5" />
              <span>User Registry</span>
            </button>
            <button
              onClick={() => setAdminTab('parents')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                adminTab === 'parents'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HeartPulse className="h-3.5 w-3.5" />
              <span>Guardians</span>
            </button>
            <button
              onClick={() => setAdminTab('stations')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                adminTab === 'stations'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Building className="h-3.5 w-3.5" />
              <span>Police Precincts</span>
            </button>
            <button
              onClick={() => setAdminTab('logs')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                adminTab === 'logs'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Emergency Logs</span>
            </button>
            <button
              onClick={() => setAdminTab('reports')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                adminTab === 'reports'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Audit Reports</span>
            </button>
          </div>
        );
    }
  };

  const renderActiveView = () => {
    switch (activeRole) {
      case 'girl':
        switch (girlTab) {
          case 'dashboard': return <GirlDashboard onOpenSOS={() => setGirlTab('sos')} />;
          case 'sos': return <SOSPage />;
          case 'contacts': return <EmergencyContacts />;
          case 'history': return <EmergencyHistory />;
          case 'profile': return <Profile />;
          default: return <GirlDashboard onOpenSOS={() => setGirlTab('sos')} />;
        }

      case 'parent':
        switch (parentTab) {
          case 'dashboard': return <ParentDashboard onOpenTracking={() => setParentTab('live')} />;
          case 'live': return <LiveLocation />;
          case 'alerts': return <ParentEmergencyAlerts />;
          case 'child-profile': return <ChildProfile />;
          default: return <ParentDashboard onOpenTracking={() => setParentTab('live')} />;
        }

      case 'police':
        switch (policeTab) {
          case 'dashboard': return <PoliceDashboard onSelectEmergency={() => setPoliceTab('tracking')} />;
          case 'tracking': return <LiveTracking />;
          case 'details': return <EmergencyDetails />;
          case 'alerts': return <PoliceEmergencyAlerts />;
          case 'response-status': return <ResponseStatus />;
          default: return <PoliceDashboard onSelectEmergency={() => setPoliceTab('tracking')} />;
        }

      case 'admin':
        switch (adminTab) {
          case 'dashboard': return <AdminDashboard />;
          case 'users': return <Users />;
          case 'parents': return <Parents />;
          case 'stations': return <PoliceStations />;
          case 'logs': return <EmergencyLogs />;
          case 'reports': return <Reports />;
          default: return <AdminDashboard />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Main Navigation */}
      <Navbar
        onOpenLogin={() => handleOpenLoginWithRole(activeRole)}
        onOpenRegister={() => handleOpenRegisterWithRole(activeRole)}
      />

      {/* Global Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={getActiveTab()}
        onSelectTab={handleSelectTab}
      />

      {/* Persistent System Status Bar */}

      {/* View Header with Sidebar Button and Portal Navigation */}
      {!(currentUser && (currentUser.role === 'girl' || currentUser.role === 'parent')) && (
        <div className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-bold transition"
              >
                <Menu className="h-4 w-4" />
                <span>Menu & Modules</span>
              </button>
              <button
                onClick={() => setCurrentRoute('landing')}
                className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-bold transition hidden sm:inline-block"
              >
                Landing Portal
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleOpenLoginWithRole(activeRole)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
              >
                Login / Switch Account
              </button>
              <button
                onClick={() => handleOpenRegisterWithRole(activeRole)}
                className="text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 px-3 py-1 rounded-lg transition"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {renderSubNav()}
        {renderActiveView()}
      </main>

      {/* Global Real-time Notification Feed Drawer */}
      <Notification />
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Girls Safety System · Real-Time Incident Response Net</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentRoute('landing')} className="hover:text-slate-700 font-semibold">
              Public Safety Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
