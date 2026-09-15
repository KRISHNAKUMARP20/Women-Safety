-- ==========================================================
-- GIRLS SAFETY SYSTEM - PRODUCTION RELATIONAL DATABASE SCHEMA
-- Compatible with PostgreSQL 13+ / MySQL 8.0+
-- ==========================================================

-- Enable UUID extension if on PostgreSQL
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('girl', 'parent', 'police', 'admin')),
    blood_group VARCHAR(8),
    medical_notes TEXT,
    avatar_url VARCHAR(512),
    battery_level INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PARENTS & GUARDIANS TABLE
CREATE TABLE IF NOT EXISTS parents (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ward_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship VARCHAR(64) NOT NULL,
    can_view_live_location BOOLEAN DEFAULT TRUE,
    receive_sms_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. POLICE STATIONS TABLE
CREATE TABLE IF NOT EXISTS police_stations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    address VARCHAR(256) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    jurisdiction_zone VARCHAR(128) NOT NULL,
    active_officers_count INT DEFAULT 10,
    available_vehicles INT DEFAULT 3,
    is_operational BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. EMERGENCY CONTACTS TABLE
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    relation VARCHAR(64) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SAFE ZONES / GEOFENCES TABLE
CREATE TABLE IF NOT EXISTS safe_zones (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    radius_meters INT NOT NULL DEFAULT 250,
    alert_on_exit BOOLEAN DEFAULT TRUE,
    alert_on_entry BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. EMERGENCIES / SOS INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS emergencies (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    user_name VARCHAR(128) NOT NULL,
    user_phone VARCHAR(32) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    accuracy_meters DECIMAL(8, 2) DEFAULT 10.0,
    address VARCHAR(256),
    battery_level INT,
    severity VARCHAR(32) NOT NULL DEFAULT 'critical' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'assigned', 'resolved', 'cancelled')),
    is_silent BOOLEAN DEFAULT FALSE,
    nearest_station_id VARCHAR(64) REFERENCES police_stations(id),
    nearest_station_name VARCHAR(128),
    distance_km DECIMAL(8, 2),
    eta_minutes INT,
    assigned_officer_name VARCHAR(128),
    assigned_officer_phone VARCHAR(32),
    assigned_patrol_car VARCHAR(64),
    resolved_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason VARCHAR(256),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. LIVE LOCATION BREADCRUMBS TABLE
CREATE TABLE IF NOT EXISTS location_breadcrumbs (
    id VARCHAR(64) PRIMARY KEY,
    emergency_id VARCHAR(64) REFERENCES emergencies(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    speed_mps DECIMAL(8, 2) DEFAULT 0.0,
    heading_deg DECIMAL(8, 2),
    accuracy DECIMAL(8, 2),
    battery_level INT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. EMERGENCY DISPATCH NOTES & LOGS TABLE
CREATE TABLE IF NOT EXISTS emergency_notes (
    id VARCHAR(64) PRIMARY KEY,
    emergency_id VARCHAR(64) NOT NULL REFERENCES emergencies(id) ON DELETE CASCADE,
    author_id VARCHAR(64) REFERENCES users(id),
    author_name VARCHAR(128) NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    recipient_user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(128) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) NOT NULL CHECK (type IN ('emergency', 'warning', 'info', 'safe_zone')),
    emergency_id VARCHAR(64) REFERENCES emergencies(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR SUB-SECOND QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_emergencies_status ON emergencies(status);
CREATE INDEX IF NOT EXISTS idx_emergencies_user_id ON emergencies(user_id);
CREATE INDEX IF NOT EXISTS idx_breadcrumbs_emergency_id ON location_breadcrumbs(emergency_id);
CREATE INDEX IF NOT EXISTS idx_breadcrumbs_recorded_at ON location_breadcrumbs(recorded_at);
CREATE INDEX IF NOT EXISTS idx_safezones_user_id ON safe_zones(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_user_id, is_read);
