package com.girlssafety.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Emergency {
    private String id;
    private String userId;
    private String userName;
    private String userPhone;
    private double lat;
    private double lng;
    private double accuracy;
    private String address;
    private int batteryLevel;
    private String severity; // low, medium, high, critical
    private String status;   // active, assigned, resolved, cancelled
    private boolean isSilent;
    private String nearestStationId;
    private String nearestStationName;
    private double distanceKm;
    private int etaMinutes;
    private String assignedOfficerName;
    private String assignedOfficerPhone;
    private List<String> notes = new ArrayList<>();
    private Instant createdAt = Instant.now();

    public Emergency() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(int batteryLevel) { this.batteryLevel = batteryLevel; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isSilent() { return isSilent; }
    public void setSilent(boolean silent) { isSilent = silent; }

    public String getNearestStationName() { return nearestStationName; }
    public void setNearestStationName(String name) { this.nearestStationName = name; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public int getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(int etaMinutes) { this.etaMinutes = etaMinutes; }

    public String getAssignedOfficerName() { return assignedOfficerName; }
    public void setAssignedOfficerName(String name) { this.assignedOfficerName = name; }

    public List<String> getNotes() { return notes; }
    public void setNotes(List<String> notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
