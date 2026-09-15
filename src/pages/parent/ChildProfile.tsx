import React, { useState } from 'react';
import {
  HeartPulse,
  Battery,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  User,
  AlertTriangle,
  Plus,
  Edit2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';

export const ChildProfile: React.FC = () => {
  const { currentUser, demoUsers } = useAuth();
  const { currentLocation, myActiveEmergency } = useEmergency();

  // Find linked ward
  const girlUser = demoUsers.find((u) => u.role === 'girl') || {
    id: 'u-girl-1',
    name: 'Maya Chen',
    role: 'girl',
    phone: '+1-555-0144',
    email: 'maya@example.com',
    batteryLevel: 82,
    bloodGroup: 'O+',
    medicalNotes: 'Mild asthma, carries inhaler. No known antibiotic allergies.',
    safeZones: [
      { id: 'sz-1', name: 'Home Residence', lat: 37.7749, lng: -122.4194, radiusMeters: 250 },
      { id: 'sz-2', name: 'University Campus', lat: 37.7833, lng: -122.4167, radiusMeters: 400 },
    ],
    emergencyContacts: [
      { id: 'c1', name: 'Sarah Chen', phone: '+1-555-0101', relation: 'Mother', isPrimary: true },
      { id: 'c2', name: 'David Chen', phone: '+1-555-0102', relation: 'Father', isPrimary: false },
    ],
  };

  const [batteryLevel] = useState(88);
  const [lastCheckIn] = useState('14 minutes ago · Campus Library');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
            alt={girlUser.name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900">{girlUser.name}</h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                Guarded Ward
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Phone: {girlUser.phone} · Active Tracking Enabled
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 rounded-2xl bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">
            <Battery className="h-4 w-4 text-emerald-600" />
            <span>{batteryLevel}% Battery</span>
          </div>
          <div className="flex items-center space-x-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Inside Safe Zone</span>
          </div>
        </div>
      </div>

      {/* Grid: Medical Vitals + Geofences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medical & Health Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <HeartPulse className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Emergency Medical Profile</h2>
              <p className="text-xs text-slate-500">Transmitted automatically to police & paramedics on SOS</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-600">Blood Group</span>
              <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
                {girlUser.bloodGroup || 'O+'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-600">Known Allergies & Medical Notes</span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {girlUser.medicalNotes || 'Mild asthma, carries inhaler. No known antibiotic allergies.'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-600">Last Verified Check-In</span>
              <div className="flex items-center space-x-2 text-xs text-slate-700 font-semibold">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{lastCheckIn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configured Geofence Boundaries */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">Configured Safe Geofences</h2>
                <p className="text-xs text-slate-500">Auto-triggers alert when boundaries are exited</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {(girlUser.safeZones || []).map((zone: any) => (
              <div
                key={zone.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-900">{zone.name}</span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      {zone.radiusMeters}m radius
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Active Guard</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Linked Emergency Contacts */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Phone className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Designated Emergency Contacts</h2>
            <p className="text-xs text-slate-500">Recipients of instant SMS broadcast with live tracking link</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(girlUser.emergencyContacts || []).map((contact: any) => (
            <div
              key={contact.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900">{contact.name}</span>
                  {contact.isPrimary && (
                    <span className="text-[10px] font-black uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {contact.relation} · {contact.phone}
                </p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="rounded-xl bg-white p-2 text-slate-700 border border-slate-200 hover:bg-slate-100 shadow-xs"
                title="Call contact"
              >
                <Phone className="h-4 w-4 text-emerald-600" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
