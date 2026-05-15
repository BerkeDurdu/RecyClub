# RecyClub 1.0 - Smart Recycling & Reward Platform

RecyClub is a full-stack recycling and reward platform.

## Architecture Overview

- **Architectural Style:** Layered Architecture (MVC) + REST API (5-layer N-tier)
- **Frontend:** React.js (SPA) — Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + Sequelize ORM
- **Auth:** JWT + bcrypt
- **External Services:** qrcode (QR), Leaflet.js + OpenStreetMap (Map), Nodemailer (Email)

## Layers

| Layer | Location | Responsibility |
|--------|-------|------------|
| Presentation | `frontend/src/` | UI rendering, REST consumption |
| Control | `backend/src/control/` | Express router, controller, JWT middleware |
| Domain | `backend/src/domain/services/` | Business rules, point calculation, QR flow |
| Resource | `backend/src/resource/` | Sequelize models, QR/Email client |
| Common | `backend/src/common/` | JWT util, error handler, DTO schema |

## Actors and Use Cases

- **Member**
- **Business Partner**
- **Admin** 

## Installation

### 1. Database

Make sure PostgreSQL is installed, then:

```sql
CREATE DATABASE recyclub;
```

### 2. Backend

```bash
cd backend
cp .env.example .env      
npm install
npm run dev                
```

On the first run, Sequelize will automatically create tables (`sync`).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                
```

## Folder Structure

```
RecyClub/
├── backend/
│   ├── config/database.js
│   ├── src/
│   │   ├── common/            # JWT util, error handler, DTO
│   │   ├── resource/
│   │   │   ├── models/        # Sequelize entities
│   │   │   └── clients/       # qrClient, emailClient
│   │   ├── domain/services/   # WasteLog, Point, Reward, Redemption ...
│   │   └── control/
│   │       ├── middleware/    # auth, role, errorHandler
│   │       ├── controllers/
│   │       └── routes/
│   └── server.js
└── frontend/
    └── src/
        ├── api/               # Axios instance
        ├── context/           # AuthContext (JWT)
        ├── pages/             # Login, Map, LogRecycling, Rewards, ...
        └── components/
```

## Flow Example — Recycling Log

1. Member fills out the form → `POST /api/waste-logs`
2. JWT middleware → WasteLogController
3. WasteLogService → PointService.calculatePoints()
4. ATOMIC: WasteLog INSERT + User.points UPDATE (PostgreSQL transaction)
5. QRService generates a unique QR code
6. NotificationService sends an async email
7. Member scans at drop-off → `POST /api/waste-logs/:id/validate`
8. Log becomes VALIDATED, points are finalized
