# Girls Safety System — Database Setup & Architecture

This directory provides the relational database migrations and initial seed dataset for the **Girls Safety System**.

## Schema Overview

The relational model includes:
- **`users`**: User records with role-based access (`girl`, `parent`, `police`, `admin`), medical notes, blood type, and device telemetry.
- **`parents`**: Guardian-to-ward relationship mapping, permissions, and alert preferences.
- **`police_stations`**: Geocoded law enforcement stations, jurisdiction boundaries, on-duty officer counts, and fleet capacity.
- **`emergencies`**: Active and historical SOS events, coordinates, triage status, assigned officers, and resolution notes.
- **`location_breadcrumbs`**: High-frequency streaming GPS tracking breadcrumbs recorded during active distress signals.
- **`safe_zones`**: Geofenced circular boundaries (e.g. Home, School, Transit Hub) with boundary departure detection.
- **`emergency_contacts`**: Prioritized emergency contacts notified via SMS and automated dialer.
- **`notifications`**: Persistent real-time notification alerts.

## Quickstart (PostgreSQL / Docker)

1. Start database container:
```bash
docker run --name girls_safety_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=girlssafety -p 5432:5432 -d postgres:15-alpine
```

2. Execute Schema:
```bash
psql -h localhost -U postgres -d girlssafety -f schema.sql
```

3. Populate Initial Seed:
```bash
psql -h localhost -U postgres -d girlssafety -f seed.sql
```
