# RecyClub 1.0 — Smart Recycling & Reward Platform

RecyClub is a full-stack recycling and reward platform. Members log household
recycling (glass, plastic, batteries, paper), earn points and badges, and
redeem them at partner businesses.

## Stack

- **Frontend:** React.js (SPA) — Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + Sequelize ORM
- **Auth:** JWT + bcrypt
- **External Services:** qrcode (QR), Leaflet.js + OpenStreetMap (Map), Nodemailer (Email)
- **Deployment:** Docker Compose (nginx + node + postgres)

## Roles

- **Member** — logs recycling, earns points and badges, redeems rewards, files complaints
- **Business Partner** — validates redemption QRs, manages own reward catalog
- **Admin** — manages users, drop-off points, complaints

---

## Run with Docker (recommended)

Requires Docker Desktop / Docker Engine + Compose v2.

```bash
docker compose up --build
```

This starts three containers:

| Service   | URL                         | Notes                              |
|-----------|-----------------------------|------------------------------------|
| Frontend  | http://localhost:8080       | nginx serving the built SPA        |
| Backend   | http://localhost:4000/api   | Express API, `/health` for probe   |
| Database  | (internal only)             | PostgreSQL 16, volume `pgdata`     |

To seed demo data into the running stack:

```bash
docker compose exec backend npm run seed
```

Stop everything with `docker compose down` (add `-v` to drop the DB volume).

---

## Manual Run (development)

### 1. Database

```sql
CREATE DATABASE recyclub;
```

### 2. Backend

```bash
cd backend
create a .env file      # fill in DB_PASSWORD, JWT_SECRET, etc.
npm install
npm run dev                # nodemon on :4000
```

On first run, Sequelize creates tables (`sync({ alter: true })` in dev only).

### 3. Frontend

```bash
cd frontend
create a .env file      # leave VITE_API_URL blank to use Vite proxy
npm install
npm run dev                # Vite on :5173
```

---

## Seed Data & Test Users

```bash
cd backend && npm run seed
```

Creates 3 users, 5 drop-off points, 6 rewards, and one demo waste-log /
redemption / complaint:

| Role     | Email                    | Password   |
|----------|--------------------------|------------|
| Admin    | admin@recyclub.local     | admin123   |
| Business | cafe@recyclub.local      | cafe123    |
| Member   | member@recyclub.local    | member123  |

---

## Folder Structure

```
RecyClub/
├── backend/
│   ├── config/database.js
│   ├── scripts/seed.js
│   ├── src/
│   │   ├── common/            # JWT, AppError, DTO
│   │   ├── resource/
│   │   │   ├── models/        # Sequelize entities
│   │   │   └── clients/       # qrClient, emailClient
│   │   ├── domain/services/   # WasteLog, Point, Reward, Redemption, Complaint, Badge ...
│   │   └── control/
│   │       ├── middleware/    # auth (JWT), role (RBAC), errorHandler
│   │       ├── controllers/
│   │       └── routes/
│   ├── tests/                 # integration tests (supertest + jest)
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios instance, JWT interceptor
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # Login, Map, LogRecycling, Rewards, Admin*, ...
│   │   └── components/
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
```

## Flow Example — Recycling Log

1. Member fills out the form → `POST /api/waste-logs`
2. JWT middleware → `WasteLogController`
3. `WasteLogService` → `PointService.calculatePoints()`
4. ATOMIC: WasteLog INSERT + User.points UPDATE (PostgreSQL transaction)
5. QRService generates a unique QR code
6. NotificationService sends an async email
7. Member scans at drop-off → `POST /api/waste-logs/validate`
8. Log becomes VALIDATED, points are finalized, `BadgeService` may award milestones
