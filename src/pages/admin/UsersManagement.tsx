import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';
import { Users, Shield, Phone, Mail, Search, Check, Filter } from 'lucide-react';

export const UsersManagement: React.FC = () => {
  const { demoUsers, switchRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/users`)
      .then((r) => r.json())
      .then((d) => {
        if (d.users) setUsers(d.users);
        else setUsers(demoUsers);
      })
      .catch(() => setUsers(demoUsers));
  }, [demoUsers]);

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'girl':
        return <span className="rounded-full bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 text-xs">Girl / Ward</span>;
      case 'parent':
        return <span className="rounded-full bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 text-xs">Parent / Guardian</span>;
      case 'police':
        return <span className="rounded-full bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 text-xs">Police Responder</span>;
      case 'admin':
        return <span className="rounded-full bg-purple-100 text-purple-700 font-bold px-2.5 py-0.5 text-xs">Admin</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">SYSTEM USER REGISTRY</h2>
          <p className="text-xs text-slate-500">
            Registered citizens, protective guardians, law enforcement personnel, and administrators.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="girl">Girl / Ward</option>
            <option value="parent">Parent</option>
            <option value="police">Police</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">User Profile</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Medical / Details</th>
              <th className="px-4 py-3 text-right">Switch Role Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={u.name}
                      className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">#{u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{getRoleBadge(u.role)}</td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="font-mono text-slate-800">{u.phone}</div>
                    <div className="text-slate-400 text-[11px]">{u.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {u.bloodGroup ? (
                    <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                      Blood: {u.bloodGroup}
                    </span>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                  {u.emergencyContacts && (
                    <div className="text-[10px] text-slate-500 mt-1">
                      {u.emergencyContacts.length} Emergency Guardians
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => switchRole(u.role, u.id)}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1 text-xs transition"
                  >
                    Act As {u.name.split(' ')[0]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
