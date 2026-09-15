import React, { useState, useEffect } from 'react';
import { Building, Car, Users, Phone, MapPin, Plus, ShieldCheck, Search } from 'lucide-react';
import { PoliceStation } from '../../types';

export const PoliceStations: React.FC = () => {
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStation, setNewStation] = useState({
    name: '',
    address: '',
    phone: '',
    lat: 37.7749,
    lng: -122.4194,
    jurisdiction: 'Metro District',
    activeOfficersCount: 12,
    availableVehicles: 4,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/police/stations`)
      .then((r) => r.json())
      .then((d) => {
        if (d.stations) setStations(d.stations);
      })
      .catch((e) => console.warn('Failed to load stations', e));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStation.name) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/police/stations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStation),
      });
      const data = await res.json();
      if (data.station) {
        setStations((prev) => [...prev, data.station]);
        setIsAdding(false);
        setNewStation({
          name: '',
          address: '',
          phone: '',
          lat: 37.7749,
          lng: -122.4194,
          jurisdiction: 'Metro District',
          activeOfficersCount: 12,
          availableVehicles: 4,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Building className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-black text-slate-900">Police Station Command Centers</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered law enforcement dispatch nodes, vehicle readiness, and sector jurisdictions.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search station or sector..."
              className="w-full rounded-2xl border border-slate-200 pl-9 p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 transition flex items-center space-x-1.5 shadow-xs whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Station</span>
          </button>
        </div>
      </div>

      {/* Add Station Modal / Panel */}
      {isAdding && (
        <form onSubmit={handleCreate} className="rounded-3xl bg-slate-50 border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-black text-slate-900">Register New Police Station</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Station Name</label>
              <input
                type="text"
                value={newStation.name}
                onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                placeholder="e.g. Central City Precinct"
                className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Address / Sector</label>
              <input
                type="text"
                value={newStation.address}
                onChange={(e) => setNewStation({ ...newStation, address: e.target.value })}
                placeholder="e.g. 767 Bryant St, San Francisco"
                className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Dispatch Phone</label>
              <input
                type="tel"
                value={newStation.phone}
                onChange={(e) => setNewStation({ ...newStation, phone: e.target.value })}
                placeholder="e.g. +1-555-911-01"
                className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 text-white px-4 py-1.5 text-xs font-bold shadow-xs"
            >
              Save Precinct
            </button>
          </div>
        </form>
      )}

      {/* Grid of Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((st) => (
          <div
            key={st.id}
            className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{st.name}</h3>
                  <span className="text-[11px] text-slate-500">{st.jurisdiction}</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>ONLINE</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 flex items-start space-x-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{st.address}</span>
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="rounded-xl bg-slate-50 p-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Patrol Cruisers</span>
                <span className="text-sm font-black text-slate-900 flex items-center space-x-1 mt-0.5">
                  <Car className="h-3.5 w-3.5 text-amber-600" />
                  <span>{st.availableVehicles} Units</span>
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Officers</span>
                <span className="text-sm font-black text-slate-900 flex items-center space-x-1 mt-0.5">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  <span>{st.activeOfficersCount} On-Duty</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <a
                href={`tel:${st.phone}`}
                className="text-slate-700 font-bold hover:text-slate-900 flex items-center space-x-1"
              >
                <Phone className="h-3 w-3 text-slate-400" />
                <span>{st.phone}</span>
              </a>
              <span className="text-[11px] font-mono text-slate-400">
                {st.lat.toFixed(3)}, {st.lng.toFixed(3)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
