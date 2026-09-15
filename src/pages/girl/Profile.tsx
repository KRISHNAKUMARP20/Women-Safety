import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { SafeZone } from '../../types';
import { User, Shield, MapPin, Heart, Check, Plus, Trash2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, updateProfile, updateSafeZones } = useAuth();
  const { currentLocation } = useEmergency();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || 'O+');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [safeZones, setSafeZones] = useState<SafeZone[]>(currentUser?.safeZones || []);

  const [isAddingZone, setIsAddingZone] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState<'home' | 'college' | 'work' | 'other'>('home');
  const [zoneRadius, setZoneRadius] = useState(300);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, phone, bloodGroup, address });
    triggerSuccess();
  };

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) return;

    const newZone: SafeZone = {
      id: `sz-${Date.now()}`,
      name: zoneName.trim(),
      type: zoneType,
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      radiusMeters: Number(zoneRadius),
    };

    const updated = [...safeZones, newZone];
    setSafeZones(updated);
    await updateSafeZones(updated);

    setZoneName('');
    setIsAddingZone(false);
    triggerSuccess();
  };

  const handleDeleteZone = async (id: string) => {
    const updated = safeZones.filter((z) => z.id !== id);
    setSafeZones(updated);
    await updateSafeZones(updated);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">MY SAFETY PROFILE & SAFE ZONES</h2>
        <p className="text-xs text-slate-500">
          Medical details and geofence safe zones ensure automated responder guidance during emergencies.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Profile and safety configuration saved successfully!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <User className="h-4 w-4 text-rose-600" />
          <span>Personal & Medical Information</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Blood Group (Critical for First Responders)</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Permanent Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment, Street, Sector"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Update Personal Details
            </button>
          </div>
        </form>
      </div>

      {/* Geofence Safe Zones */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>Geofenced Safe Zones ({safeZones.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Parents receive automated alerts when you arrive at or depart from these perimeter zones.
            </p>
          </div>
          <button
            onClick={() => setIsAddingZone(!isAddingZone)}
            className="flex items-center space-x-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 text-xs font-bold hover:bg-purple-100 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Zone Here</span>
          </button>
        </div>

        {/* Add Zone Form */}
        {isAddingZone && (
          <form
            onSubmit={handleAddZone}
            className="mb-4 rounded-xl border border-purple-200 bg-purple-50/50 p-4 space-y-3 text-xs"
          >
            <div className="font-bold text-purple-900">
              Create Geofence at Current GPS ({currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My College Campus"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={zoneType}
                  onChange={(e) => setZoneType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
                >
                  <option value="home">Home</option>
                  <option value="college">University / College</option>
                  <option value="work">Workplace / Office</option>
                  <option value="other">Transit Hub / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Safety Radius: {zoneRadius} meters
                </label>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={zoneRadius}
                  onChange={(e) => setZoneRadius(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingZone(false)}
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-purple-600 px-4 py-1 text-xs font-bold text-white hover:bg-purple-700 shadow-sm"
              >
                Save Geofence
              </button>
            </div>
          </form>
        )}

        {/* List of Zones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {safeZones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-start justify-between text-xs"
            >
              <div>
                <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                  <MapPin className="h-3.5 w-3.5 text-purple-600" />
                  <span>{zone.name}</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500 font-medium capitalize">
                  Type: {zone.type} · Radius: {zone.radiusMeters}m
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
                </div>
              </div>

              <button
                onClick={() => handleDeleteZone(zone.id)}
                className="p-1 text-slate-400 hover:text-rose-600"
                title="Remove Geofence"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
