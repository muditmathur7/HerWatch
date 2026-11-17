# HerWatch — Smart Women's Safety Platform 🛡️

A comprehensive safety platform combining real-time location tracking, emergency SOS alerts, danger hotspot detection, and one-tap emergency response.

---

## 📁 Repository Structure

```text
HerWatch/
├── herwatch-frontend/        # Angular 21 Frontend with Tailwind CSS & SSR
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Guards, Auth Interceptors, Services
│   │   │   ├── features/     # Auth, Dashboard, Contacts, Reports, Profile, Settings
│   │   │   └── shared/       # Navbar, Sidebar, TypeScript Interfaces
│   │   └── environments/    # API & WebSocket endpoints config
│   └── package.json
│
├── herwatch-backend/         # Python FastAPI Backend
│   ├── app/
│   │   ├── api/              # Versioned API routes (auth, contacts, reports, sos)
│   │   ├── core/             # Database connection, JWT security, bcrypt hashing
│   │   ├── models/           # SQLAlchemy models (User, EmergencyContact, IncidentReport, SOSAlert)
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── config.py         # App configuration & environment loader
│   │   └── main.py           # FastAPI entrypoint, CORS & Lifespan
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Database & environment variables
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Backend Setup (`herwatch-backend`)

#### Prerequisites
* Python 3.10+ (Python 3.12 / 3.14 tested)
* MySQL Server 8.0 running locally

#### Setup Steps
```bash
# Navigate to backend folder
cd herwatch-backend

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies (already pre-installed)
pip install -r requirements.txt

# Configure Database in .env
# Edit DATABASE_URL in .env with your MySQL credentials:
# DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/herwatch

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```
* **API Server:** `http://localhost:8000`
* **Interactive Swagger API Docs:** `http://localhost:8000/docs`

---

### 2. Frontend Setup (`herwatch-frontend`)

#### Prerequisites
* Node.js v20+ and npm

#### Setup Steps
```bash
# Navigate to frontend folder
cd herwatch-frontend

# Start Angular development server
npm start
```
* **App URL:** `http://localhost:4200`

---

## ⚡ Core Features Implemented

1. **Authentication & Security:**
   * Multi-step registration (Personal Info, Password, Username, 4-Digit Emergency PIN).
   * JWT Bearer authentication attached automatically to all HTTP requests via `authInterceptor`.
   * Secure bcrypt password and PIN hashing.
2. **Emergency SOS System:**
   * One-touch emergency trigger with 5-second countdown to prevent accidental activation.
   * Instant emergency dispatch simulation to registered contacts and response teams.
   * Disarm protection requiring the user's 4-digit security PIN.
3. **Real-Time GPS Tracking:**
   * Continuous breadcrumb GPS coordinate logging via `navigator.geolocation.watchPosition`.
   * Real-time WebSocket broadcasting (`/ws/sos/{id}`) for live maps.
4. **Emergency One-Tap Helplines:**
   * Direct calling for **National Emergency (112)**, **Women Helpline (1091)**, **Ambulance (102)**, and **Child Helpline (1098)**.
5. **Trusted Contacts Management:**
   * Add, list, and delete emergency contacts with relationship tagging and primary contact designations.
   * One-click direct phone dialer for each contact.
6. **Incident Reporting & Hotspots Detection:**
   * Community hazard reporting (Harassment, Stalking, Unlit Street, Theft, Suspicious Activity).
   * Auto-detection of current GPS coordinates for incident logging.
   * Automatic spatial clustering calculating real-time safety hotspots.
