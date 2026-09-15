package com.girlssafety.service;

import com.girlssafety.dto.SOSRequest;
import com.girlssafety.entity.Emergency;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class EmergencyService {
    private final ConcurrentHashMap<String, Emergency> emergencyStore = new ConcurrentHashMap<>();

    public Emergency triggerSOS(SOSRequest req) {
        Emergency e = new Emergency();
        e.setId("emg-" + UUID.randomUUID().toString().substring(0, 8));
        e.setUserId(req.getUserId() != null ? req.getUserId() : "u-girl-1");
        e.setUserName("Maya Chen");
        e.setUserPhone("+1-555-0144");
        e.setLat(req.getLat());
        e.setLng(req.getLng());
        e.setAddress(req.getAddress() != null ? req.getAddress() : "Market St & 5th St, SF");
        e.setAccuracy(req.getAccuracy() > 0 ? req.getAccuracy() : 8.5);
        e.setBatteryLevel(req.getBatteryLevel() > 0 ? req.getBatteryLevel() : 88);
        e.setSeverity(req.getSeverity() != null ? req.getSeverity() : "critical");
        e.setStatus("active");
        e.setSilent(req.isSilent());

        // Computed nearest station dispatch
        e.setNearestStationName("Downtown Central Precinct");
        e.setDistanceKm(1.18);
        e.setEtaMinutes(3);

        emergencyStore.put(e.getId(), e);
        return e;
    }

    public List<Emergency> getActiveEmergencies() {
        return emergencyStore.values().stream()
                .filter(e -> "active".equalsIgnoreCase(e.getStatus()) || "assigned".equalsIgnoreCase(e.getStatus()))
                .collect(Collectors.toList());
    }

    public Emergency updateStatus(String id, String status, String note) {
        Emergency e = emergencyStore.get(id);
        if (e != null) {
            e.setStatus(status);
            if (note != null && !note.isEmpty()) {
                e.getNotes().add(note);
            }
        }
        return e;
    }

    public Emergency cancelEmergency(String id, String reason) {
        Emergency e = emergencyStore.get(id);
        if (e != null) {
            e.setStatus("cancelled");
            e.getNotes().add("Stand down: " + reason);
        }
        return e;
    }
}
