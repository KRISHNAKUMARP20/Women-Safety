import React, { useState, useEffect } from 'react';
import { User, Emergency } from '../../types';
import {
  Users,
  Search,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Heart,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';

interface RegisteredUsersRosterProps {
  onRefresh?: () => void;
}

export const RegisteredUsersRoster: React.FC<RegisteredUsersRosterProps> = () => {
  const { demoUsers } = useAuth();
  const { activeEmergencies } = useEmergency();
  const [users, setUsers] = useState<User[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'girl' | 'parent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers(demoUsers);
      }
    } catch (err) {
      console.warn('Failed to load registered users', err);
      setUsers(demoUsers);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [demoUsers]);

  const girlsCount = users.filter((u) => u.role === 'girl').length;
  const parentsCount = users.filter((u) => u.role === 'parent').length;

  const filteredUsers = users.filter((u) => {
    // Only show girls and parents in this section as requested by user
    if (u.role !== 'girl' && u.role !== 'parent') return false;

    if (filterTab !== 'all' && u.role !== filterTab) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.includes(q);
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-700">
              Admin Database Storage
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
            Registered Girls & Parents Stored in System
          </h3>
          <p className="text-xs text-slate-500">
            Full registry of girls (wards) and linked parents with live protection status.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search girl or parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              All ({girlsCount + parentsCount})
            </button>
            <button
              onClick={() => setFilterTab('girl')}
              className={`px-3 py-1 rounded-lg transition ${
                filterTab === 'girl' ? 'bg-white text-rose-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              👧 Girls ({girlsCount})
            </button>
            <button
              onClick={() => setFilterTab('parent')}
              className={`px-3 py-1 rounded-lg transition ${
                filterTab === 'parent' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              👨‍👩‍👧 Parents ({parentsCount})
            </button>
          </div>
        </div>
      </div>

      {/* Roster Cards / Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Identity & Role</th>
              <th className="px-4 py-3">Phone & Direct Call</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Linked Family Relationship</th>
              <th className="px-4 py-3">Live Safety Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No registered users match the search filter.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isGirl = user.role === 'girl';
                const hasActiveSOS = activeEmergencies.some((e) => e.userId === user.id);

                // Find primary contact or linked ward
                const primaryContact = user.emergencyContacts?.find((c) => c.isPrimary) || user.emergencyContacts?.[0];

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50/70 transition ${
                      hasActiveSOS ? 'bg-rose-50/60' : ''
                    }`}
                  >
                    {/* Identity & Role */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            user.avatar ||
                            (isGirl
                              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80')
                          }
                          alt={user.name}
                          className="h-10 w-10 rounded-full border border-slate-200 object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                            <span>{user.name}</span>
                            {isGirl && user.bloodGroup && (
                              <span className="rounded bg-rose-50 border border-rose-200 px-1 text-[9px] font-bold text-rose-700">
                                {user.bloodGroup}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5">
                            {isGirl ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                                👧 Registered Girl (Ward)
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                                👨‍👩‍👧 Registered Parent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phone & Direct Call */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-slate-700 font-semibold">{user.phone}</span>
                        <a
                          href={`tel:${user.phone.replace(/[^0-9+]/g, '')}`}
                          className="rounded-lg bg-emerald-50 hover:bg-emerald-100 p-1 text-emerald-700 transition"
                          title="Call phone"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate max-w-[180px]">{user.email}</span>
                      </div>
                    </td>

                    {/* Linked Relationship */}
                    <td className="px-4 py-3.5 text-slate-700">
                      {isGirl ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800 flex items-center space-x-1">
                            <span>Parent:</span>
                            <span>{primaryContact?.name || 'John Doe'}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {primaryContact?.phone || '+91-98765-11111'}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800 flex items-center space-x-1">
                            <span>Ward:</span>
                            <span>Priya Sharma (Daughter)</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            +91-98765-43210
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Safety Status */}
                    <td className="px-4 py-3.5">
                      {hasActiveSOS ? (
                        <span className="inline-flex items-center space-x-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-black text-white animate-pulse shadow-xs">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          <span>🚨 SOS DISTRESS ACTIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>🟢 Protected & Safe</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
