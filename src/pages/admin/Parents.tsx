import React, { useState } from 'react';
import { Users, Phone, Mail, ShieldCheck, Search, HeartPulse, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Parents: React.FC = () => {
  const { demoUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const parentsList = [
    {
      id: 'p-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+1-555-0101',
      relation: 'Mother',
      wardName: 'Maya Chen',
      wardPhone: '+1-555-0144',
      status: 'Active Guardian',
      safeZonesCount: 2,
      lastActive: 'Active now',
    },
    {
      id: 'p-2',
      name: 'David Chen',
      email: 'david.chen@example.com',
      phone: '+1-555-0102',
      relation: 'Father',
      wardName: 'Maya Chen',
      wardPhone: '+1-555-0144',
      status: 'Active Guardian',
      safeZonesCount: 2,
      lastActive: '2 hours ago',
    },
    {
      id: 'p-3',
      name: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      phone: '+1-555-0133',
      relation: 'Mother',
      wardName: 'Ananya Sharma',
      wardPhone: '+1-555-0122',
      status: 'Verified',
      safeZonesCount: 3,
      lastActive: 'Yesterday',
    },
  ];

  const filtered = parentsList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.wardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-black text-slate-900">Guardian & Parent Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered family guardians authorized to receive live telemetry, geofence breaches, and SOS broadcasts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search parent or ward..."
            className="w-full rounded-2xl border border-slate-200 pl-9 p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Guardian Name</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Linked Ward</th>
                <th className="px-6 py-3.5">Geofences</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((parent) => (
                <tr key={parent.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="font-black text-slate-900">{parent.name}</div>
                    <div className="text-[11px] text-slate-400">{parent.relation}</div>
                  </td>
                  <td className="px-6 py-4 space-y-0.5">
                    <div className="flex items-center space-x-1 text-slate-700">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{parent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <span>{parent.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-rose-600 flex items-center space-x-1">
                      <span>👧 {parent.wardName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{parent.wardPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                      <MapPin className="h-3 w-3" />
                      <span>{parent.safeZonesCount} Zones</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{parent.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`tel:${parent.phone}`}
                      className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 transition text-[11px]"
                    >
                      Dial Phone
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
