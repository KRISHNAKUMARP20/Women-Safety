import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, EmergencyContact, SafeZone } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  demoUsers: User[];
  isLoading: boolean;
  activeRole: UserRole;
  login: (credentials: { userId?: string; role?: string; email?: string; parentPhone?: string }) => Promise<User>;
  register: (userData: Partial<User>) => Promise<User>;
  switchUser: (userId: string) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateContacts: (contacts: EmergencyContact[]) => Promise<void>;
  updateSafeZones: (safeZones: SafeZone[]) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadInitialUser = async () => {
    try {
      setIsLoading(true);
      const allDemoUsers = await authService.getDemoUsers();
      setDemoUsers(allDemoUsers);

      const savedUserId = localStorage.getItem('gss_current_user_id');
      if (savedUserId) {
        try {
          const fullProfile = await authService.getProfile(savedUserId);
          setCurrentUser(fullProfile);
          return;
        } catch (e) {
          console.warn('Failed to load profile for saved user ID. Account may have been wiped.', e);
          localStorage.removeItem('gss_current_user_id');
          setCurrentUser(null);
          return;
        }
      }

      // If no saved user, start unauthenticated so they can register
      setCurrentUser(null);
    } catch (e) {
      console.error('Failed to load user session', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialUser();
  }, []);

  const login = async (credentials: { userId?: string; role?: string; email?: string; parentPhone?: string }): Promise<User> => {
    try {
      setIsLoading(true);
      const res = await authService.login(credentials);
      setCurrentUser(res.user);
      localStorage.setItem('gss_current_user_id', res.user.id);
      // Refresh demo users so newly updated contact details reflect system-wide
      const allUsers = await authService.getDemoUsers();
      setDemoUsers(allUsers);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<User> => {
    try {
      setIsLoading(true);
      const res = await authService.register(userData);
      setCurrentUser(res.user);
      localStorage.setItem('gss_current_user_id', res.user.id);
      const allUsers = await authService.getDemoUsers();
      setDemoUsers(allUsers);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (userId: string) => {
    try {
      setIsLoading(true);
      const res = await authService.login({ userId });
      setCurrentUser(res.user);
      localStorage.setItem('gss_current_user_id', res.user.id);
    } catch (e) {
      console.error('Switch user failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (role: UserRole) => {
    const matched = demoUsers.find((u) => u.role === role);
    if (matched) {
      await switchUser(matched.id);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = await authService.updateProfile(currentUser.id, updates);
    setCurrentUser(updated);
  };

  const updateContacts = async (contacts: EmergencyContact[]) => {
    if (!currentUser) return;
    const updatedContacts = await authService.updateContacts(currentUser.id, contacts);
    setCurrentUser((prev) => (prev ? { ...prev, emergencyContacts: updatedContacts } : null));
  };

  const updateSafeZones = async (safeZones: SafeZone[]) => {
    if (!currentUser) return;
    const updatedZones = await authService.updateSafeZones(currentUser.id, safeZones);
    setCurrentUser((prev) => (prev ? { ...prev, safeZones: updatedZones } : null));
  };

  const refreshProfile = async () => {
    if (!currentUser) return;
    const refreshed = await authService.getProfile(currentUser.id);
    setCurrentUser(refreshed);
  };

  const logout = () => {
    localStorage.removeItem('gss_current_user_id');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        demoUsers,
        isLoading,
        activeRole: currentUser?.role || 'girl',
        login,
        register,
        switchUser,
        switchRole,
        updateProfile,
        updateContacts,
        updateSafeZones,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
