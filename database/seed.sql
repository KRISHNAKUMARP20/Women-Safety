-- ==========================================================
-- GIRLS SAFETY SYSTEM - COMPREHENSIVE SEED DATA
-- ==========================================================

-- 1. SEED USERS
INSERT INTO users (id, name, email, phone, password_hash, role, blood_group, medical_notes, avatar_url, battery_level)
VALUES
('u-girl-1', 'Maya Chen', 'maya@example.com', '+1-555-0144', '$2a$12$eXampLeHashPasswordGirl123', 'girl', 'O+', 'Mild asthma, carries albuterol inhaler. No penicillin allergy.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', 88),
('u-parent-1', 'Sarah Chen', 'sarah@example.com', '+1-555-0101', '$2a$12$eXampLeHashPasswordParent123', 'parent', 'A+', NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', 95),
('u-police-1', 'Officer James Miller', 'dispatch@police.gov', '+1-555-0199', '$2a$12$eXampLeHashPasswordPolice123', 'police', 'B+', 'Authorized Dispatcher & Field Commander', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 100),
('u-admin-1', 'Chief Director Vance', 'admin@safetynet.org', '+1-555-0100', '$2a$12$eXampLeHashPasswordAdmin123', 'admin', 'O-', 'Central Command Administrator', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', 100)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED POLICE STATIONS
INSERT INTO police_stations (id, name, address, phone, latitude, longitude, jurisdiction_zone, active_officers_count, available_vehicles)
VALUES
('station-1', 'Downtown Central Precinct', '767 Bryant St, San Francisco, CA 94103', '+1-415-553-0123', 37.7758, -122.4042, 'Central Downtown / SOMA', 18, 5),
('station-2', 'Mission District Police Station', '630 Valencia St, San Francisco, CA 94110', '+1-415-558-5400', 37.7628, -122.4219, 'Mission / Castro Sector', 14, 4),
('station-3', 'Northern Police Station', '2475 Fillmore St, San Francisco, CA 94115', '+1-415-614-3400', 37.7925, -122.4344, 'Pacific Heights / Marina', 12, 3),
('station-4', 'Tenderloin Substation', '301 Eddy St, San Francisco, CA 94102', '+1-415-345-7300', 37.7839, -122.4143, 'Tenderloin / Civic Center', 16, 4)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED EMERGENCY CONTACTS
INSERT INTO emergency_contacts (id, user_id, name, phone, relation, is_primary)
VALUES
('c-1', 'u-girl-1', 'Sarah Chen', '+1-555-0101', 'Mother', TRUE),
('c-2', 'u-girl-1', 'David Chen', '+1-555-0102', 'Father', FALSE),
('c-3', 'u-girl-1', 'Aunt Claire', '+1-555-0103', 'Aunt', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED SAFE ZONES
INSERT INTO safe_zones (id, user_id, name, latitude, longitude, radius_meters, alert_on_exit)
VALUES
('sz-1', 'u-girl-1', 'Home Residence (Sunset District)', 37.7749, -122.4194, 250, TRUE),
('sz-2', 'u-girl-1', 'University Campus Quad', 37.7833, -122.4167, 400, TRUE),
('sz-3', 'u-girl-1', 'Metro Central Transit Hub', 37.7795, -122.4137, 200, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED PARENT RELATIONSHIPS
INSERT INTO parents (id, user_id, ward_user_id, relationship, can_view_live_location, receive_sms_alerts)
VALUES
('rel-1', 'u-parent-1', 'u-girl-1', 'Mother', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED PAST EMERGENCIES (HISTORICAL INCIDENTS)
INSERT INTO emergencies (id, user_id, user_name, user_phone, latitude, longitude, accuracy_meters, address, battery_level, severity, status, is_silent, nearest_station_id, nearest_station_name, distance_km, eta_minutes, assigned_officer_name, assigned_officer_phone, assigned_patrol_car, resolved_at)
VALUES
('emg-past-1', 'u-girl-1', 'Maya Chen', '+1-555-0144', 37.7812, -122.4150, 6.5, '550 Market St, Financial District', 74, 'high', 'resolved', FALSE, 'station-1', 'Downtown Central Precinct', 1.12, 3, 'Officer J. Miller', '+1-555-0199', 'Cruiser 4', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('emg-past-2', 'u-girl-1', 'Maya Chen', '+1-555-0144', 37.7650, -122.4200, 8.0, 'Mission St & 18th St', 62, 'critical', 'resolved', TRUE, 'station-2', 'Mission District Police Station', 0.85, 2, 'Officer R. Davis', '+1-555-0188', 'Patrol 12', CURRENT_TIMESTAMP - INTERVAL '14 days')
ON CONFLICT (id) DO NOTHING;
