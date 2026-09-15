# Girls Safety System (GSS)

An enterprise-grade, real-time women safety, live emergency tracking, and rapid law enforcement dispatch platform. Designed with zero paid third-party map dependencies (utilizing Leaflet and OpenStreetMap), sub-second real-time event streaming, geofenced perimeter guardrails, and role-based incident portals for Girls, Parents, Police, and Administrators.

---

## Complete Project Structure

```
girls-safety-system/
│
├── frontend/
│   ├── public/
│   │   ├── logo.png
│   │   └── emergency-icon.png
│   │
│   └── src/
│       ├── assets/
│       │   ├── images/
│       │   └── icons/
│       │
│       ├── components/
│       │   ├── Navbar.jsx (Navbar.tsx)
│       │   ├── Sidebar.jsx (Sidebar.tsx)
│       │   ├── SOSButton.jsx (SOSButton.tsx)
│       │   ├── LocationMap.jsx (LocationMap.tsx)
│       │   ├── EmergencyCard.jsx (EmergencyCard.tsx)
│       │   ├── Notification.jsx (Notification.tsx)
│       │   ├── FullScreenSOSOverlay.tsx
│       │   └── Loading.jsx (Loading.tsx)
│       │
│       ├── pages/
│       │   ├── LandingPage.jsx (LandingPage.tsx)
│       │   ├── Login.jsx (Login.tsx)
│       │   ├── Register.jsx (Register.tsx)
│       │   │
│       │   ├── girl/
│       │   │   ├── GirlDashboard.jsx (GirlDashboard.tsx)
│       │   │   ├── Profile.jsx (Profile.tsx)
│       │   │   ├── EmergencyContacts.jsx (EmergencyContacts.tsx)
│       │   │   ├── EmergencyHistory.jsx (EmergencyHistory.tsx)
│       │   │   └── SOSPage.jsx (SOSPage.tsx)
│       │   │
│       │   ├── parent/
│       │   │   ├── ParentDashboard.jsx (ParentDashboard.tsx)
│       │   │   ├── EmergencyAlerts.jsx (EmergencyAlerts.tsx)
│       │   │   ├── LiveLocation.jsx (LiveLocation.tsx)
│       │   │   └── ChildProfile.jsx (ChildProfile.tsx)
│       │   │
│       │   ├── police/
│       │   │   ├── PoliceDashboard.jsx (PoliceDashboard.tsx)
│       │   │   ├── EmergencyAlerts.jsx (EmergencyAlerts.tsx)
│       │   │   ├── LiveTracking.jsx (LiveTracking.tsx)
│       │   │   ├── EmergencyDetails.jsx (EmergencyDetails.tsx)
│       │   │   └── ResponseStatus.jsx (ResponseStatus.tsx)
│       │   │
│       │   └── admin/
│       │       ├── AdminDashboard.jsx (AdminDashboard.tsx)
│       │       ├── Users.jsx (Users.tsx)
│       │       ├── Parents.jsx (Parents.tsx)
│       │       ├── PoliceStations.jsx (PoliceStations.tsx)
│       │       ├── EmergencyLogs.jsx (EmergencyLogs.tsx)
│       │       └── Reports.jsx (Reports.tsx)
│       │
│       ├── services/
│       │   ├── authService.js (authService.ts)
│       │   ├── userService.js (userService.ts)
│       │   ├── emergencyService.js (emergencyService.ts)
│       │   ├── locationService.js (locationService.ts)
│       │   ├── notificationService.js (notificationService.ts)
│       │   └── policeService.js (policeService.ts)
│       │
│       ├── context/
│       │   ├── AuthContext.jsx (AuthContext.tsx)
│       │   └── EmergencyContext.jsx (EmergencyContext.tsx)
│       │
│       ├── routes/
│       │   └── AppRoutes.jsx (AppRoutes.tsx)
│       │
│       ├── App.jsx (App.tsx)
│       └── main.jsx (main.tsx)
│
├── backend/
│   └── src/
│       └── main/
│           ├── java/com/girlssafety/
│           │   ├── controller/
│           │   ├── service/
│           │   ├── repository/
│           │   ├── entity/
│           │   ├── dto/
│           │   ├── security/
│           │   ├── websocket/
│           │   └── exception/
│           └── resources/
│               └── application.properties
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
│
├── docs/
│   ├── api-documentation.md
│   ├── system-architecture.md
│   └── database-design.md
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Key Core Capabilities

1. **One-Hold & Stealth Silent SOS**:
   - 3-second hold trigger to eliminate false positives.
   - Optional silent dispatch beacon (disables on-device audio sirens to protect user from aggressors).
   - High-visibility full-screen pulsing animation with 4-stage intercept pipeline progress.

2. **Nearest Police Station Proximity Engine**:
   - Computes distance using the Haversine algorithm in sub-milliseconds.
   - Calculates real-time patrol unit vectoring and driving ETA.
   - Transmits encrypted user coordinates, device battery status, and medical allergy profile.

3. **Guardian Geofenced Safe Zones**:
   - Parents configure circular boundary fences (e.g., Home, School, Transit Center).
   - Automatically fires alerts if boundaries are crossed after designated hours.

4. **Multi-Role Portals**:
   - **👧 Girl / Ward**: One-tap SOS, safe zones, fake phone call escape simulator, emergency contacts, past dispatch history.
   - **👨‍👩‍👧 Parent / Guardian**: Live breadcrumb tracking on Leaflet OpenStreetMap, battery telemetry, child medical notes.
   - **👮 Police Console**: Incident intake, patrol vehicle assignment, response status tracking, audio sirens.
   - **🛡️ Command Admin**: System telemetry, user registry, guardian registry, station management, CSV audit log exports.

5. **Free Tier Technology Stack**:
   - Frontend: React 18, TypeScript, Tailwind CSS, Lucide Icons, Leaflet OpenStreetMap.
   - Real-time: Server-Sent Events (SSE) & WebSocket telemetry with zero third-party map subscription costs.
