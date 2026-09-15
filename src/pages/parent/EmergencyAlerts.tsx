import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { NotificationAlert } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

export const EmergencyAlerts: React.FC = () => {
  const { notifications, emergencies } = useEmergency();
  const [alerts, setAlerts] = useState<NotificationAlert[]>([]);

  useEffect(() => {
    fetch('/api/parents/alerts')
      .then((r) => r.json())
      .then((d) => {
        if (d.alerts) setAlerts(d.alerts);
      })
      .catch((e) => console.warn('Failed to load parent alerts', e));
  }, [notifications]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">PARENT EMERGENCY ALERTS & LOGS</h2>
        <p className="text-xs text-slate-500">
          Chronological record of SOS dispatches, perimeter geofence entries/exits, and police dispatch communications.
        </p>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            <CheckCircle className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Incidents Recorded</h4>
            <p className="text-xs text-slate-500 mt-1">
              Your ward has maintained safety with no active alerts.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border p-4 shadow-sm bg-white transition hover:shadow-md ${
                alert.severity === 'high'
                  ? 'border-rose-300 bg-rose-50/40'
                  : alert.severity === 'medium'
                  ? 'border-amber-300 bg-amber-50/30'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                      alert.severity === 'high'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : alert.severity === 'medium'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {alert.type === 'sos' ? <ShieldAlert className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{alert.message}</p>
                    <div className="mt-2 flex items-center space-x-3 text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </span>
                      <span className="capitalize font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {alert.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
