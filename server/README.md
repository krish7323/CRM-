# ⚙️ TELA CRM & ERP — Backend Server Architecture & API Guide

> **Node.js, Express, MongoDB Atlas, TypeScript & Socket.IO API Subsystem**  
> Powering the European Language Academy Institutional Management System.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/mongodb-8.3-47a248.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/realtime-Socket.IO%204.7-black.svg)](https://socket.io/)
[![TypeScript Ready](https://img.shields.io/badge/typescript-tsconfig%20configured-blue.svg)](https://www.typescriptlang.org/)

---

## 📑 Table of Contents

- [Server Overview](#-server-overview)
- [TypeScript & ES Modules Configuration](#-typescript--es-modules-configuration)
- [Folder Structure](#-folder-structure)
- [Core Models & Schemas](#-core-models--schemas)
- [Key Business Logic Modules](#-key-business-logic-modules)
  - [1. Student Graduation & Batch Seat Relief](#1-student-graduation--batch-seat-relief)
  - [2. Conflict-Free Timetable Validation](#2-conflict-free-timetable-validation)
  - [3. QR-Code Verifiable Certificates](#3-qr-code-verifiable-certificates)
  - [4. Role-Based Access Control (RBAC)](#4-role-based-access-control-rbac)
- [Environment Configuration](#-environment-configuration)
- [Available Scripts](#-available-scripts)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Real-Time WebSocket Events](#-real-time-websocket-events)

---

## 🌟 Server Overview

The backend is an enterprise-grade REST and WebSocket API built with Node.js and Express. It connects to **MongoDB Atlas** using Mongoose ODM, implements JWT authentication with role authorization, and provides real-time event broadcasting via Socket.IO.

### Core Technologies
- **Runtime:** Node.js (v18+) with native ES Modules (`"type": "module"`)
- **Web Framework:** Express 4.19 with Helmet security and CORS
- **Database:** MongoDB Atlas via Mongoose 8.3 with automatic fallback guards
- **Real-Time Engine:** Socket.IO 4.7
- **Authentication:** JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **PDF Generation:** PDFKit 0.15 for high-resolution gold-embossed certificates

---

## ⚙️ TypeScript & ES Modules Configuration

The server includes a configured `tsconfig.json` for TypeScript type-checking, IntelliSense, and compilation:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "lib": ["es2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

The runtime runs natively using ES Module syntax (`import` / `export`), allowing seamless interoperability and modern JavaScript standards.

---

## 📂 Folder Structure

```
server/
├── package.json              # Server dependencies & scripts
├── tsconfig.json             # TypeScript compiler configuration
├── src/
│   ├── index.js              # Server entry point, middleware, Socket.IO & static serving
│   ├── controllers/          # Business logic handlers
│   │   ├── authController.js # Authentication, login, profile retrieval
│   │   └── ...
│   ├── middleware/           # Express middlewares
│   │   ├── auth.js           # JWT verification & role authorization (verifyToken, requireRole)
│   │   └── ...
│   ├── models/               # 25 Mongoose database models
│   │   ├── User.js           # Institutional staff & roles
│   │   ├── Student.js        # Active student & alumni records
│   │   ├── Batch.js          # Class batches & seat capacity
│   │   ├── Course.js         # Language curriculum & CEFR levels
│   │   ├── Attendance.js     # Daily attendance marks
│   │   ├── Fee.js            # Invoices, payments, receipts
│   │   ├── Expense.js        # Operational expenses
│   │   ├── Certificate.js    # Verifiable credentials & QR codes
│   │   ├── Lead.js           # CRM inquiry pipeline
│   │   ├── Exam.js           # Tests & marks
│   │   ├── Library.js        # Book issues and catalog
│   │   └── ...
│   ├── routes/               # API route definitions
│   │   ├── authRoutes.js     # /api/auth endpoints
│   │   ├── apiRoutes.js      # Core ERP & CRM CRUD endpoints
│   │   └── admissionRoutes.js# Self-service admission portal endpoints
│   └── utils/
│       ├── seedData.js       # Master director seed data initialization
│       └── pdfGenerator.js   # PDF receipt and certificate generator
```

---

## 💡 Key Business Logic Modules

### 1. Student Lifecycle Management & Zero-Data-Loss Archival
The application enforces strict institutional data preservation policies:
1. **Status Enum:** Supports `Active`, `Graduated`, `Dropped Out`, `Fee Defaulter`, and `Inactive`.
2. **Zero Hard Delete Policy:** Student records are never dropped from the database in regular administrative workflows. Status transitions mark `isArchived: true` on the same document so historical attendance, fee receipts, invoices, and certificates remain 100% linked.
3. **Unified Transition Endpoint:** `POST /api/students/:id/change-status` records every transition in `statusHistory` (`fromStatus`, `toStatus`, `reason`, `changedBy`, `date`).
4. **Automatic Seat Capacity Relief:** Any transition from `Active` to non-active status automatically decrements the batch's `enrolledCount` by 1 (`Math.max(0, batch.currentEnrolledCount - 1)`), immediately freeing a seat.
5. **Attendance Exclusion:** The daily roll-call query in `AttendancePage` automatically filters `status: "Active"`, preventing non-active students from appearing in daily rosters while preserving their entire historical attendance ledger.
6. **Alumni & Archive Registry:** Provides full searchable history, status filter pills, audit modal, and one-click Next-Level Re-enrollment/Promotion (e.g., German A1 → German A2).
7. **Automated Fee Defaulter Detection:** Endpoint `GET /api/students/fee-defaulters/check` scans for unpaid fee plans overdue past 60 days, flagging students for administrative review without auto-deletion.

### 2. Conflict-Free Timetable Validation
Before confirming new batch schedules, the system verifies:
- Classroom room availability (no duplicate room assignment at the same time window).
- Instructor availability (no faculty double-booking).

### 3. QR-Code Verifiable Certificates
Every issued certificate receives a cryptographically unique serial number:
- Public verification route: `GET /api/public/verify/:certNumber` (unauthenticated, publicly accessible for employers, universities, and embassies).
- Returns verified student credentials, course level, completion date, and academy seal.

### 4. Role-Based Access Control (RBAC)
Supported institutional roles:
- **Director / Admin:** Full unrestricted administrative access.
- **Counsellor:** CRM leads, admissions, call logs.
- **Teacher:** Attendance marking, grades, batches, homework.
- **Accountant:** Fees, receipts, expenses, profit & loss.
- **Librarian:** Book catalog and circulation.
- **Transport Manager:** Bus routes and fleet tracking.
- **HR Manager:** Staff records and payroll tracking.
- **Student / Parent:** Personal self-service portals.

---

## 🔐 Environment Configuration

Place an `.env` file in the project root or `server/` directory:

```env
# Server Port (auto-fallbacks to 5001 if occupied)
PORT=5000

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/iia_institute_erp?retryWrites=true&w=majority

# JWT Security Secrets
JWT_SECRET=elh_super_secret_jwt_key_2026_european_language_hub
JWT_REFRESH_SECRET=elh_super_secret_refresh_jwt_key_2026

# Frontend Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

---

## 🚀 Available Scripts

From the `server/` directory:

```bash
# Start backend server in development mode (with auto-reload)
npm run dev

# Start backend server in production mode
npm start
```

---

## 📡 API Endpoints Overview

| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Live server health, uptime, and database status |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns JWT token |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user profile |
| `GET` | `/api/public/verify/:certNumber` | Public | Instant verification of certificate authenticity |
| `GET` | `/api/students` | Staff | Returns master directory of students (supports status query filters) |
| `POST` | `/api/students` | Staff / Admin | Direct student intake with duplicate check & batch capacity enforcement |
| `POST` | `/api/students/:id/change-status` | Director / Admin / Teacher | Unified lifecycle status transition (Graduated, Dropped Out, Fee Defaulter, Inactive) with batch seat relief |
| `POST` | `/api/students/:id/graduate` | Director / Admin / Teacher | Course graduation, batch seat release, certificate generation |
| `GET` | `/api/students/fee-defaulters/check` | Director / Accountant | Automated check for overdue fees (>60 days) |
| `DELETE` | `/api/students/:id` | Director Only | Restricted duplicate/test removal only (`confirmTestEntry=true` required) |
| `GET` | `/api/batches` | Authenticated | Lists all academic batches and live seat counts |
| `POST` | `/api/batches` | Admin / Director | Creates a new academic batch |
| `GET` | `/api/leads` | Counsellor / Admin | Fetches prospective candidate leads |
| `POST` | `/api/leads` | Counsellor / Admin | Adds a prospective candidate lead |
| `GET` | `/api/attendance` | Teacher / Admin | Batch attendance register logs (active students) |
| `POST` | `/api/attendance` | Teacher / Admin | Submits batch session attendance |
| `GET` | `/api/fees` | Accountant / Admin | Tuition invoices and payment records |
| `POST` | `/api/fees` | Accountant / Admin | Creates fee invoice |
| `POST` | `/api/fees/:id/payment` | Accountant / Admin | Records student fee payment and updates balance |
| `GET` | `/api/expenses` | Accountant / Admin | Operating expenses & financial audit entries |

---

## ⚡ Real-Time WebSocket Events (Socket.IO)

The server runs Socket.IO to power instant notifications and live cross-screen synchronization:

| Event | Direction | Scope / Channel | Description |
| :--- | :--- | :--- | :--- |
| `student:created` | Server → Client | Global & Role Rooms | Emitted upon direct admission or lead enrollment |
| `student:updated` | Server → Client | Global & Role Rooms | Emitted when student details are updated |
| `student:status-changed` | Server → Client | Global & Role Rooms | Emitted on status transitions (Graduated, Dropped Out, Defaulter) |
| `student:deleted` | Server → Client | Global & Role Rooms | Emitted when a test entry is purged |
| `batch:seat-updated` | Server → Client | Global & `batch:<batchCode>` | Live broadcast of updated batch capacity & enrolled count |
| `batch:created` | Server → Client | Global | Emitted when new batch is scheduled |
| `attendance:marked` | Server → Client | Global & `batch:<batchCode>` | Emitted when session attendance is recorded |
| `fee:payment-received` | Server → Client | Global & `role:Accountant` | Emitted when student fee payment is recorded |
| `fee:invoice-created` | Server → Client | Global & `role:Accountant` | Emitted when initial invoice or new fee is generated |
| `lead:stage-changed` | Server → Client | Global & `role:Counsellor` | Emitted when lead moves through CRM funnel |

---

© 2026 **The European Language Academy (TELA)**. All rights reserved.
