import { store } from '../database/store';
import { matchNearestPoliceStation } from './policeMatchService';
import { NotificationService } from './notificationService';
import { Emergency, EmergencySeverity, EmergencyStatus } from '../models/types';
import nodemailer from 'nodemailer';

export class EmergencyService {
  public static triggerSOS(params: {
    userId: string;
    lat: number;
    lng: number;
    address?: string;
    accuracy?: number;
    batteryLevel?: number;
    severity?: EmergencySeverity;
    isSilent?: boolean;
    medicalInfo?: string;
  }): Emergency {
    const user = store.getUserById(params.userId);
    const userName = user?.name || 'Protected User';
    const userPhone = user?.phone || 'Unknown';
    const userBloodGroup = user?.bloodGroup || 'Not specified';

    // Adapt stations if user is testing far from default coordinates
    store.adaptStationsAroundLocation(params.lat, params.lng);

    // Find nearest police station using Haversine calculation
    const stations = store.getPoliceStations();
    const match = matchNearestPoliceStation(params.lat, params.lng, stations);

    const stationId = match ? match.station.id : (stations[0]?.id || 'ps-1');
    const stationName = match ? match.station.name : 'Central Quick Response Division';
    const distanceKm = match ? match.distanceKm : 1.2;
    const etaMinutes = match ? match.etaMinutes : 5;

    const emergencyId = `emg-${Date.now()}`;
    const newEmergency: Emergency = {
      id: emergencyId,
      userId: params.userId,
      userName,
      userPhone,
      userBloodGroup,
      lat: params.lat,
      lng: params.lng,
      address: params.address || `GPS: ${params.lat.toFixed(4)}, ${params.lng.toFixed(4)}`,
      accuracyMeters: params.accuracy || 8,
      batteryLevel: params.batteryLevel ?? 75,
      status: 'active',
      severity: params.severity || 'critical',
      nearestStationId: stationId,
      nearestStationName: stationName,
      distanceKm,
      etaMinutes,
      isSilent: params.isSilent || false,
      medicalInfo: params.medicalInfo || (user?.bloodGroup ? `Blood Group: ${user.bloodGroup}` : undefined),
      notes: [
        {
          id: `n-${Date.now()}`,
          author: 'Automated Dispatch System',
          role: 'admin',
          text: `SOS broadcast received from ${userName}. Nearest station: ${stationName} (${distanceKm} km, ETA: ${etaMinutes} mins).`,
          timestamp: new Date().toISOString(),
        }
      ],
      locationHistory: [
        { lat: params.lat, lng: params.lng, timestamp: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
    };

    store.createEmergency(newEmergency);

    // Gather contacts to notify
    const contacts = user?.emergencyContacts?.map((c) => `${c.name} (${c.phone})`) || [];
    NotificationService.sendEmergencyAlert({
      emergencyId,
      victimName: userName,
      address: newEmergency.address,
      lat: params.lat,
      lng: params.lng,
      nearestStationName: stationName,
      distanceKm,
      contacts,
      isSilent: newEmergency.isSilent,
    });

    // Send Email Alert via Nodemailer
    if (user?.emergencyContacts && user.emergencyContacts.length > 0) {
      const googleMapsLink = `https://maps.google.com/?q=${params.lat},${params.lng}`;
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // App Password
        },
      });

      user.emergencyContacts.forEach((contact) => {
        if (!contact.email) {
           console.log(`⚠️ Skip Email to ${contact.name}: No email address provided.`);
           return;
        }

        const mailOptions = {
          from: `"Safety Alert System" <${process.env.EMAIL_USER}>`,
          to: contact.email,
          subject: `🚨 EMERGENCY SOS ALERT: ${userName} Needs Help!`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid red; border-radius: 10px;">
              <h2 style="color: red;">🚨 CRITICAL EMERGENCY SOS 🚨</h2>
              <p><strong>${userName}</strong> has triggered an emergency SOS!</p>
              <p><strong>Battery Level:</strong> ${params.batteryLevel}%</p>
              <p><strong>Blood Group:</strong> ${userBloodGroup}</p>
              <p><strong>Phone:</strong> ${userPhone}</p>
              <hr/>
              <p><strong>Live Location:</strong></p>
              <a href="${googleMapsLink}" style="display:inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">View on Google Maps</a>
              <br/><br/>
              <p>The nearest police station (${stationName}) has been notified.</p>
            </div>
          `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(`❌ [EMAIL ERROR] Failed to send to ${contact.email}:`, error.message);
            } else {
              console.log(`✅ [EMAIL] SOS Email successfully sent to ${contact.email}!`);
            }
          });
        } else {
          console.log(`\n⚠️ [EMAIL WARNING] Email credentials missing in .env file!`);
          console.log(`⚠️ You must add EMAIL_USER and EMAIL_PASS to send real emails.`);
          console.log(`🚀 [SIMULATION] Fake Email to ${contact.email} would have been sent!`);
          console.log(`========================================================\n`);
        }
      });
    }

    return newEmergency;
  }

  public static updateLocation(emergencyId: string, lat: number, lng: number) {
    const emergency = store.getEmergencyById(emergencyId);
    if (!emergency) return null;

    emergency.lat = lat;
    emergency.lng = lng;
    emergency.locationHistory.push({
      lat,
      lng,
      timestamp: new Date().toISOString(),
    });

    // Recalculate distance to nearest station
    const stations = store.getPoliceStations();
    const match = matchNearestPoliceStation(lat, lng, stations);
    if (match) {
      emergency.distanceKm = match.distanceKm;
      emergency.etaMinutes = match.etaMinutes;
    }

    return store.updateEmergency(emergencyId, {
      lat,
      lng,
      distanceKm: emergency.distanceKm,
      etaMinutes: emergency.etaMinutes,
      locationHistory: emergency.locationHistory,
    });
  }

  public static updateStatus(
    emergencyId: string,
    status: EmergencyStatus,
    officerDetails?: { name?: string; phone?: string; stationId?: string },
    noteText?: string
  ): Emergency | null {
    const emergency = store.getEmergencyById(emergencyId);
    if (!emergency) return null;

    const updates: Partial<Emergency> = { status };

    if (officerDetails?.name) updates.assignedOfficerName = officerDetails.name;
    if (officerDetails?.phone) updates.assignedOfficerPhone = officerDetails.phone;
    if (officerDetails?.stationId) updates.assignedStationId = officerDetails.stationId;
    if (status === 'resolved') updates.resolvedAt = new Date().toISOString();

    const updated = store.updateEmergency(emergencyId, updates);

    if (noteText) {
      store.addEmergencyNote(
        emergencyId,
        officerDetails?.name || 'Dispatcher',
        'police',
        noteText
      );
    }

    // Send push update to girl, parent, admin
    let alertTitle = `Emergency Status Updated: ${status.toUpperCase()}`;
    let alertMessage = `Emergency #${emergencyId} for ${emergency.userName} is now ${status.replace('_', ' ')}.`;

    if (status === 'assigned') {
      alertTitle = `Police Unit Dispatched!`;
      alertMessage = `${officerDetails?.name || 'Officer'} assigned to ${emergency.userName}. Responding immediately.`;
    } else if (status === 'resolved') {
      alertTitle = `Emergency Resolved`;
      alertMessage = `${emergency.userName} is marked safe and incident is closed.`;
    }

    NotificationService.sendStatusUpdate({
      emergencyId,
      title: alertTitle,
      message: alertMessage,
      targetRoles: ['girl', 'parent', 'police', 'admin'],
      severity: status === 'resolved' ? 'info' : 'medium',
    });

    store.addAuditLog(
      `STATUS_${status.toUpperCase()}`,
      officerDetails?.name || 'Police Dispatch',
      'police',
      `Emergency #${emergencyId} changed to ${status}.`
    );

    return updated;
  }

  public static cancelSOS(emergencyId: string, reason = 'False Alarm'): Emergency | null {
    const emergency = store.getEmergencyById(emergencyId);
    if (!emergency) return null;

    const updated = store.updateEmergency(emergencyId, {
      status: 'cancelled',
      resolvedAt: new Date().toISOString(),
    });

    store.addEmergencyNote(
      emergencyId,
      emergency.userName,
      'girl',
      `SOS Cancelled by user. Reason: ${reason}`
    );

    NotificationService.sendStatusUpdate({
      emergencyId,
      title: `SOS Alert Cancelled by ${emergency.userName}`,
      message: `Emergency signal cancelled (${reason}). Stand down for responding units.`,
      targetRoles: ['parent', 'police', 'admin'],
      severity: 'info',
    });

    store.addAuditLog('SOS_CANCELLED', emergency.userName, 'girl', `Emergency #${emergencyId} cancelled. Reason: ${reason}`);

    return updated;
  }
}
