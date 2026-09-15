# Girls Safety System — Complete API Documentation

This specification details all endpoints exposed by the **Girls Safety System Backend** for authentication, real-time SOS broadcasting, GPS telemetry, guardian alerts, and police dispatch operations.

---

## 1. Authentication & User Profile Endpoints

### `POST /api/auth/login`
Authenticates a user or demo persona.
- **Request Body:**
  ```json
  {
    "userId": "u-girl-1",
    "role": "girl",
    "email": "maya@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "u-girl-1",
      "name": "Maya Chen",
      "email": "maya@example.com",
      "phone": "+1-555-0144",
      "role": "girl",
      "bloodGroup": "O+",
      "batteryLevel": 88
    }
  }
  ```

### `POST /api/auth/register`
Creates a new account and profile.
- **Request Body:**
  ```json
  {
    "name": "Maya Chen",
    "email": "maya@example.com",
    "phone": "+1-555-0144",
    "role": "girl",
    "bloodGroup": "O+",
    "medicalNotes": "Mild asthma"
  }
  ```

### `GET /api/auth/profile`
Fetches user details with contacts and configured safe zones.

---

## 2. Emergency & SOS Distress Endpoints

### `POST /api/emergencies/sos`
Triggers an emergency SOS alert. Automatically computes the nearest police station via Haversine distance, calculates ETA, alerts designated contacts via simulated SMS, and broadcasts to police consoles.
- **Request Body:**
  ```json
  {
    "userId": "u-girl-1",
    "lat": 37.7749,
    "lng": -122.4194,
    "address": "Market St & 5th St, SF",
    "accuracy": 8.5,
    "batteryLevel": 88,
    "severity": "critical",
    "isSilent": false,
    "medicalInfo": "Blood Group O+, carries inhaler"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "emergency": {
      "id": "emg-948271a",
      "userId": "u-girl-1",
      "userName": "Maya Chen",
      "userPhone": "+1-555-0144",
      "status": "active",
      "lat": 37.7749,
      "lng": -122.4194,
      "nearestStationName": "Downtown Central Precinct",
      "distanceKm": 1.18,
      "etaMinutes": 3,
      "createdAt": "2026-09-14T08:12:00.000Z"
    }
  }
  ```

### `GET /api/emergencies/active`
Retrieves all currently active or assigned emergency incidents.

### `PATCH /api/emergencies/:id/status`
Updates incident status (e.g. `assigned`, `resolved`, `cancelled`), assigns patrol officer details, and appends dispatch notes.
- **Request Body:**
  ```json
  {
    "status": "assigned",
    "officerDetails": {
      "name": "Officer J. Miller",
      "phone": "+1-555-0199",
      "stationId": "station-1"
    },
    "note": "Cruiser 4 dispatched on high-priority vector."
  }
  ```

### `POST /api/emergencies/:id/cancel`
Stands down active SOS beacon with cancellation reason.

---

## 3. Real-Time Location & Telemetry

### `POST /api/location/update`
Submits continuous high-frequency GPS breadcrumbs.
- **Request Body:**
  ```json
  {
    "userId": "u-girl-1",
    "lat": 37.7752,
    "lng": -122.4190,
    "speed": 1.2,
    "heading": 85.0,
    "batteryLevel": 87
  }
  ```

### `GET /api/events` (Server-Sent Events)
Live push stream delivering sub-second updates:
- `emergency_triggered`: New SOS broadcast
- `location_update`: Real-time breadcrumb coordinates
- `status_change`: Police assignment & resolution updates
- `geofence_breach`: Safe zone exit warnings

---

## 4. Police Command & Precinct Endpoints

### `GET /api/police/stations`
Lists all registered police stations, coordinates, active officers, and available vehicles.

### `POST /api/police/stations`
Registers a new police precinct or dispatch center.
