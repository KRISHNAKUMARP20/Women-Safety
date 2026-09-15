package com.girlssafety.dto;

public class SOSRequest {
    private String userId;
    private double lat;
    private double lng;
    private String address;
    private double accuracy;
    private int batteryLevel;
    private String severity;
    private boolean isSilent;
    private String medicalInfo;

    public SOSRequest() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

    public int getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(int batteryLevel) { this.batteryLevel = batteryLevel; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public boolean isSilent() { return isSilent; }
    public void setSilent(boolean silent) { isSilent = silent; }

    public String getMedicalInfo() { return medicalInfo; }
    public void setMedicalInfo(String medicalInfo) { this.medicalInfo = medicalInfo; }
}
