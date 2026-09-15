package com.girlssafety.controller;

import com.girlssafety.dto.SOSRequest;
import com.girlssafety.entity.Emergency;
import com.girlssafety.service.EmergencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergencies")
@CrossOrigin(origins = "*")
public class EmergencyController {

    @Autowired
    private EmergencyService emergencyService;

    @PostMapping("/sos")
    public ResponseEntity<Map<String, Object>> triggerSOS(@RequestBody SOSRequest request) {
        Emergency emergency = emergencyService.triggerSOS(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "success", true,
            "emergency", emergency,
            "message", "Emergency distress beacon dispatched to nearest police unit and emergency contacts."
        ));
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveEmergencies() {
        List<Emergency> emergencies = emergencyService.getActiveEmergencies();
        return ResponseEntity.ok(Map.of("success", true, "emergencies", emergencies));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        String status = (String) payload.get("status");
        String note = (String) payload.get("note");
        Emergency emergency = emergencyService.updateStatus(id, status, note);
        return ResponseEntity.ok(Map.of("success", true, "emergency", emergency));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelSOS(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "False Alarm");
        Emergency emergency = emergencyService.cancelEmergency(id, reason);
        return ResponseEntity.ok(Map.of("success", true, "emergency", emergency));
    }
}
