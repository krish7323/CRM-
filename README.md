# 🏛️ TELA — The European Language Academy & Institute ERP Suite

> **Comprehensive Enterprise CRM, Academic ERP, Financial Management & Multi-Role Portal System**
> Built for European language training institutes, academies, and modern educational institutions.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/database-MongoDB%20Atlas-47a248.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/realtime-Socket.IO%204.7-black.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

---

## 📑 Table of Contents

- [Executive Overview](#-executive-overview)
- [Key Features & System Modules](#-key-features--system-modules)
  - [1. CRM & Lead Conversion Pipeline](#1-crm--lead-conversion-pipeline)
  - [2. Admissions & Student Registry](#2-admissions--student-registry)
  - [3. Academic Programs, Batches & Conflict-Free Timetable](#3-academic-programs-batches--conflict-free-timetable)
  - [4. Attendance & Faculty Check-In Engine](#4-attendance--faculty-check-in-engine)
  - [5. Exams, Grading & Result Publication](#5-exams-grading--result-publication)
  - [6. Financial Suite: Fee Invoices & Expense P&L](#6-financial-suite-fee-invoices--expense-pl)
  - [7. Verifiable Certificates with QR Code Registry](#7-verifiable-certificates-with-qr-code-registry)
  - [8. Academic Operations & Student Services](#8-academic-operations--student-services)
  - [9. Real-Time Communication & Automation](#9-real-time-communication--automation)
  - [10. Dedicated Portals & Public Gateways](#10-dedicated-portals--public-gateways)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Environment Configuration](#1-environment-configuration)
  - [2. Installation](#2-installation)
  - [3. Running Development Servers](#3-running-development-servers)
  - [4. Production Build](#4-production-build)
- [Default Login Credentials](#-default-login-credentials)
- [API Reference](#-api-reference)
- [Docker & Containerized Deployment](#-docker--containerized-deployment)
- [Cloud Deployment (Render)](#-cloud-deployment-render)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🌟 Executive Overview

**TELA (The European Language Academy) CRM & ERP** is a modern, unified management platform designed to streamline all institutional operations. From prospective student inquiry capture to multi-level language certification, TELA unifies:

- **Lead Nurturing:** End-to-end CRM with Kanban drag-and-drop, follow-up call schedules, and automated reminders.
- **Academic Administration:** Course structures (German Goethe/CEFR A1–B2, French DELF, Business English), classroom conflict detection, and faculty scheduling.
- **Fee Management:** Flexible installment plans, invoice generation, balance tracking, and expense auditing.
- **Security & Integrity:** Instant QR-code-based certificate authenticity verification and granular role-scoped access control.

---

## 🚀 Key Features & System Modules

### 1. CRM & Lead Conversion Pipeline
- **Kanban Board:** Visual sales pipeline categorizing candidates across stages: `New`, `Contacted`, `Interested`, `Demo`, `Enrolled`, and `Lost`.
- **Inquiry Capture:** Fast intake dialog capturing candidate name, WhatsApp contact, course interest, source (Walk-in, Instagram, Google, Referral), and notes.
- **Follow-up Call Scheduler:** Prioritized call lists, last contact timestamps, reminder logs, and one-click interaction status updates.
- **Conversion Tracking:** Seamlessly transition any interested candidate into an officially enrolled student profile without re-entering details.

### 2. Admissions & Student Registry
- **Student Master Directory:** Searchable index by student ID, roll number, batch, or language track.
- **Document Vault:** Secure digital archive for identity proofs (Aadhaar, Passport), academic transcripts, visa documents, and enrollment agreements.
- **Self-Serve Admissions (`/apply`):** Public-facing enrollment portal for prospective students and parents to submit applications directly.

### 3. Academic Programs, Batches & Conflict-Free Timetable
- **Curriculum Architecture:** Configurable courses (German, French, Spanish, Business English) with modular CEFR levels, duration, and credit hours.
- **Timetable Conflict Matrix:** Intelligent weekly matrix preventing classroom double-booking and faculty scheduling overlap.
- **Batch Quota Monitors:** Real-time progress indicators displaying student seat capacity (`Enrolled / Max Seats`).

### 4. Attendance & Faculty Check-In Engine
- **Student Attendance Register:** Quick-marking interface for batch sessions with `Present`, `Absent`, `Late`, and `Excused` states.
- **Faculty Working Hours:** Daily check-in / check-out timekeeper logging instructor presence for automated payroll calculation.
- **Absence Analytics:** Visual metrics identifying attendance thresholds below institutional standards.

### 5. Exams, Grading & Result Publication
- **Examination Scheduler:** Mid-term, final, and CEFR mock exam scheduling with designated room assignments.
- **Scorecards & Grade Tracking:** Mark entry system computing letter grades, percentiles, and academic standing.

### 6. Financial Suite: Fee Invoices & Expense P&L
- **Tuition Invoicing:** Itemized fee plans supporting full payments, installment milestones, and scholarships.
- **Payment Collection:** Multiple payment mode logging (Cash, UPI, Net Banking, Cheque) with instant receipt numbering.
- **Operational Expense Tracker:** Overhead ledger categorizing expenditures (Campus rent, utility bills, software, marketing, salaries) and dynamic Profit & Loss analytics.

### 7. Verifiable Certificates with QR Code Registry
- **CEFR Gold-Embossed Certificates:** One-click certificate generation with student score, CEFR mastery level, and unique credential ID.
- **Public Verification Gateway (`/verify/:certNumber`):** Anyone (employers, universities, embassies) can scan the QR code to verify credential authenticity in real-time.

### 8. Academic Operations & Student Services
- **Digital Library Management:** Book inventory catalog, issue/return date tracking, and overdue fine calculations.
- **Homework & Assignment Hub:** Faculty assignment broadcast with submission deadlines and review feedback.
- **Scholarship & Concession Desk:** Financial aid application review, fee waivers, and discount authorizations.
- **Parent-Teacher Meetings (PTM):** Scheduled parent consultation slots with meeting minutes and notes.
- **Campus Fleet & Transport:** Bus route mappings, vehicle logs, driver contacts, and student pick-up points.
- **Asset & Hardware Inventory:** Tracking of campus assets, projectors, language lab systems, and furniture.

### 9. Real-Time Communication & Automation
- **WhatsApp Integration Module:** Pre-formatted messaging templates for fee reminders, attendance alerts, and admission follow-ups.
- **Live Institute Chat:** Real-time socket-based internal channel for staff coordination.
- **Broadcast Notice Board:** Pinned announcements, circulars, and event notifications.

### 10. Dedicated Portals & Public Gateways
- **Student Portal (`/student-portal`):** Student-facing dashboard showing enrolled batches, attendance stats, homework, and exam results.
- **Parent Portal (`/parent-portal`):** Parent dashboard monitoring ward's attendance, fee installment dues, and notices.
- **Public Verification (`/verify/:certNumber`):** Standalone, unauthenticated credential validation engine.

---

## 🛡️ Role-Based Access Control (RBAC)

The application enforces fine-grained permissions across 9 distinct institutional roles:

| Role | Access Scope |
| :--- | :--- |
| **Owner / Admin** | Unrestricted access across all operational, financial, academic, security, and administrative modules. |
| **Counsellor** | CRM pipeline, candidate follow-ups, student intake, WhatsApp messaging, and basic directory. |
| **Teacher / Faculty** | Batches, timetable, student attendance, exams & marks, homework assignments, and faculty check-in. |
| **Accountant** | Invoicing, fee receipts, payment reconciliation, expense logs, scholarships, and financial analytics. |
| **Librarian** | Book catalog, library issue/return registry, inventory assets, and reading resources. |
| **Transport Manager** | Vehicle roster, bus routes, driver details, and student transit allocations. |
| **HR Manager** | Staff records, payroll attendance records, faculty leave requests, and audit logs. |
| **Student** | Student Portal view: personal classes, homework, exam marks, library records, and notices. |
| **Parent** | Parent Portal view: ward's attendance, pending fee invoices, PTM schedules, and circulars. |

> **Live Role Tester:** Administrators can instantly preview the interface from any role's perspective using the header dropdown selector.

---

## 🏗️ System Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│   React 18  •  Vite 5  •  Tailwind CSS  •  Zustand  • Recharts│
│                Socket.IO Client  •  Lucide Icons            │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / WebSocket (Port 5173 -> 5000)
┌──────────────────────────────▼──────────────────────────────┐
│                      Server Layer                           │
│   Node.js  •  Express.js  •  JWT Auth  •  Helmet Security   │
│         Socket.IO Server  •  PDFKit  •  Winston             │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
┌──────────────────────────────▼──────────────────────────────┐
│                     Database Layer                          │
│               MongoDB Atlas / Local MongoDB                 │
│         (25 Schemas: Leads, Students, Fees, etc.)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Folder Structure

```
CRM/
├── .env                      # Global environment variables
├── docker-compose.yml        # Docker composition for full stack + MongoDB
├── package.json              # Root coordination scripts
├── render.yaml               # Cloud deployment descriptor (Render)
│
├── client/                   # Frontend React Application
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts        # Vite setup with /api proxy to backend
│   ├── tailwind.config.js    # Tailwind styling system
│   └── src/
│       ├── App.jsx           # App shell, routing & route guards
│       ├── components/       # Reusable layout & UI components
│       │   ├── layout/       # Sidebar, Header, AuthGuard, RoleGuard
│       │   └── ...
│       ├── pages/            # 32 Application Pages
│       │   ├── DashboardPage.jsx
│       │   ├── CRMPage.jsx
│       │   ├── FollowupsPage.jsx
│       │   ├── StudentsPage.jsx
│       │   ├── AdmissionsPage.jsx
│       │   ├── CoursesPage.jsx
│       │   ├── BatchesPage.jsx
│       │   ├── AttendancePage.jsx
│       │   ├── ExamsPage.jsx
│       │   ├── FeesPage.jsx
│       │   ├── ExpensesPage.jsx
│       │   ├── CertificatesPage.jsx
│       │   ├── VerifyCertificatePage.jsx
│       │   ├── ParentPortalPage.jsx
│       │   ├── StudentPortalPage.jsx
│       │   └── ...
│       ├── store/            # Zustand central application store
│       │   └── useAppStore.js
│       └── utils/            # Helper utilities & export tools
│
└── server/                   # Backend Express & Node.js API
    ├── package.json
    └── src/
        ├── index.js          # API bootstrap, Socket.IO & static build server
        ├── controllers/      # Auth & API controllers
        ├── middleware/       # JWT authentication & RBAC guards
        ├── models/           # 25 Mongoose database models
        │   ├── User.js
        │   ├── Lead.js
        │   ├── Student.js
        │   ├── Course.js
        │   ├── Batch.js
        │   ├── Fee.js
        │   ├── Expense.js
        │   ├── Certificate.js
        │   └── ...
        ├── routes/           # REST endpoint definitions
        └── utils/            # Database seeder & PDF generation
```

---

## ⚡ Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or later ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or later
- **MongoDB**: Active MongoDB Atlas connection URI or local MongoDB instance on `mongodb://localhost:27017`

---

### 1. Environment Configuration

Create or verify the `.env` file in the project root:

```env
# Server Port
PORT=5000

# Database Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/iia_institute_erp?retryWrites=true&w=majority

# Authentication Secrets
JWT_SECRET=elh_super_secret_jwt_key_2026_european_language_hub
JWT_REFRESH_SECRET=elh_super_secret_refresh_jwt_key_2026

# Allowed Frontend Origin
CLIENT_URL=http://localhost:5173

# Environment Mode
NODE_ENV=development
```

---

### 2. Installation

Install all backend and frontend dependencies from the project root:

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Return to root
cd ..
```

---

### 3. Running Development Servers

You can run both client and server independently:

#### Start Backend Server:
```bash
cd server
npm run dev
```
*Backend runs at: [http://localhost:5000](http://localhost:5000)*

#### Start Frontend Client (in a separate terminal):
```bash
cd client
npm run dev
```
*Frontend runs at: [http://localhost:5173](http://localhost:5173)*

> **Automatic Proxy:** Requests sent to `/api/*` from the frontend Vite server are automatically proxied to `http://localhost:5000`.

---

### 4. Production Build

To build the client for production:

```bash
cd client
npm run build
```

The optimized build will be output to `client/dist`. The Express backend is pre-configured to automatically serve `client/dist` static assets when accessed directly at `http://localhost:5000`.

---

## 🔑 Default Login Credentials

The database automatically seeds a master administrator account upon first launch:

| Field | Default Value |
| :--- | :--- |
| **Email** | `admin@elh.edu` |
| **Password** | `password123` |
| **Name** | Dinesha & Niresh |
| **Role** | Owner / Admin |

> **Tip:** You can switch roles live using the **"Test View"** role selector in the top-right header to experience the app as a Counsellor, Teacher, Accountant, etc.

---

## 📡 API Reference

All protected endpoints require an `Authorization: Bearer <token>` header obtained from `/api/auth/login`.

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieves current authenticated profile |
| `GET` | `/api/public/verify/:certNumber` | Public | Instant verification of certificate authenticity |
| `GET` | `/api/leads` | Admin, Counsellor | Fetches all CRM prospective candidate leads |
| `POST` | `/api/leads` | Admin, Counsellor | Adds a new prospective candidate lead |
| `GET` | `/api/students` | Admin, Counsellor, Teacher | Returns registered students directory |
| `GET` | `/api/courses` | Authenticated | Lists all academic courses and CEFR programs |
| `GET` | `/api/batches` | Authenticated | Fetches batch schedules and timetable allocations |
| `GET` | `/api/attendance` | Admin, Teacher | Retrieves batch attendance logs |
| `GET` | `/api/fees` | Admin, Accountant | Invoices, receipts, and outstanding dues |
| `GET` | `/api/expenses` | Admin, Accountant | Institutional operating expenses and P&L entries |
| `GET` | `/api/exams` | Admin, Teacher, Student | Exam dates and results |
| `GET` | `/api/library/books` | Admin, Teacher, Librarian | Digital library catalog |
| `GET` | `/api/homework` | Admin, Teacher, Student | Homework tasks and assignment submissions |
| `GET` | `/api/scholarships` | Admin, Accountant | Concession and scholarship grants |
| `GET` | `/api/transport/routes` | Admin, Transport, Parent | Transport routes and bus stops |
| `GET` | `/api/notices` | Authenticated | Circulars and academy announcements |
| `GET` | `/api/chat/messages` | Authenticated | Real-time messages for staff room |

---

## 🐳 Docker & Containerized Deployment

Run the complete multi-container stack (Database + API + Frontend) with a single command:

```bash
docker-compose up --build -d
```

This starts:
- **MongoDB Container:** Exposed on port `27017`
- **Node.js Express API Container:** Exposed on port `5000`
- **Frontend Nginx / Client Container:** Exposed on port `80`

To stop all containers:
```bash
docker-compose down
```

---

## ☁️ Cloud Deployment (Render)

The repository includes a ready-to-use [`render.yaml`](./render.yaml) blueprint:

1. Push your repository to GitHub / GitLab.
2. Log in to [Render](https://render.com/) and choose **"New Blueprint Instance"**.
3. Select your repository. Render will automatically configure:
   - **Backend Web Service:** Builds and runs `server/src/index.js` on Node.js.
   - **Frontend Static Site:** Bundles `client/dist` with rewrite rules pointing to `/index.html`.
4. Add your production `MONGODB_URI` and `JWT_SECRET` in the Render Environment settings.

---

## ❓ Troubleshooting & FAQs

#### 1. Port 5000 is already in use
The server has built-in auto-recovery. If port 5000 is occupied, it automatically increments and attempts port `5001`. Alternatively, kill the occupied process or change `PORT=5005` in `.env`.

#### 2. MongoDB connection warning / fallback
If the remote MongoDB Atlas cluster cannot be reached (e.g. firewall or network timeout), the server logs a warning and continues running in standalone API mode without crashing, ensuring the UI remains operable.

#### 3. Client build issues
Make sure your Node version is >= 18. Delete `node_modules` and run `npm install` inside `client/` to resolve dependency conflicts.

---

## 📄 License

This software is licensed under the MIT License. See [LICENSE](LICENSE) for details.

© 2026 **The European Language Academy (TELA)**. All rights reserved.
