# CertiVerify — Codtech IT Solutions Certificate Issuance & Verification Platform

A production-quality full-stack platform built for **CODTECH IT SOLUTIONS PRIVATE LIMITED** allowing organizations and academic heads to issue, manage, and publicly verify certificates for internships, project completions, and technical assessments against a live canonical database.

Inspired by real-world educational credentials and the official **Codtech IT Solutions** certificate ecosystem.

---

## 🌟 Key Highlights & Authentic Features

1. **Authentic Corporate & Educational Identity**:
   - Matches the official **CODTECH IT SOLUTIONS PVT. LTD.** branding, registered Hyderabad campus address, HR helpline (`+91 9848925128`), and official emails.
   - Includes real corporate trust elements: **ISO 9001:2015 Quality Management Certified**, **AICTE Curriculum Guidelines**, **MSME (Udyam)**, and **#startupindia (DPIIT)** accreditations.

2. **Dual Verification Experience**:
   - **Canonical Portal Summary View**: Matches the exact mobile/desktop layout from `codtechlearning.com` with the verified status header, deep blue card banner, and structured student/course sections.
   - **Interactive Original Certificate Document View**: Displays the authentic certificate with gold/orange geometric accents, corporate seals, authorized signature of **Neela Santhosh Kumar (HR & Academic Head)**, and QR code.

3. **High-Density Vector PDF Generation**:
   - Built with **PDFKit**, generating printable A4 certificates matching the physical parchment.
   - Includes embedded QR codes linking directly to the live verification endpoint.
   - If a certificate is revoked, the PDF automatically prints a diagonal red revocation watermark and invalidation notice.

4. **Robust Security & Cryptographic Integrity**:
   - JWT authentication over secure HTTP-only cookies.
   - bcrypt password hashing for administrative access.
   - Helmet security headers, rate limiting on authentication and public verification endpoints, CORS configuration with explicit allowed origins.
   - Input validation using Zod on both client and server (enforcing completion dates $\le$ issue dates).
   - Append-only, immutable **Audit Log** tracking every issuance, revocation, verification, and PDF export.

5. **HR & Academic Console**:
   - Real database statistics aggregation (Total Issued, Active Valid, Revoked, by Type).
   - 1-Click program templates (Data Analytics, Full-Stack Web Development, Cloud Architecture).
   - Search, status/type filters, pagination, and revocation dialog with mandatory reason tracking.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 with Vite & TypeScript
  - Tailwind CSS with dark mode support
  - React Router v6
  - React Hook Form + Zod validation
  - Lucide React icons
  - Axios with cookie support
  - Canvas Confetti

- **Backend**:
  - Node.js & Express with TypeScript
  - MongoDB Atlas / local MongoDB with Mongoose
  - JWT in HTTP-only cookies
  - bcryptjs for password hashing
  - PDFKit for vector PDF generation
  - `qrcode` for QR code generation
  - Zod request validators
  - Helmet & rate limiting (`express-rate-limit`)

- **Testing**:
  - Vitest & Supertest with 20 automated integration tests.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18 or newer)
- MongoDB running locally on `mongodb://127.0.0.1:27017` OR a MongoDB Atlas connection string.

### 2. Clone and Install Dependencies
From the project root:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Return to root
cd ..
```

### 3. Environment Configuration
Create `.env` in `server/` (or use the provided defaults):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/certiverify
JWT_SECRET=super_secure_certiverify_jwt_secret_change_in_production_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:5173
COOKIE_SECURE=false
```

### 4. Seed Initial Admin & Demo Certificates
Populate the database with the initial administrator and reference certificates (including `DC6E30F05C735E02` and `CITS24`):
```bash
# Run demo seeder from root
npm run seed:demo
```

Default administrator credentials:
- **Email**: `admin@certiverify.com`
- **Password**: `Admin@123456`
- **Signatory**: Neela Santhosh Kumar (HR & Academic Head)

### 5. Run the Application
Open two terminal windows:

**Terminal 1 (Backend API)**:
```bash
cd server
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 (Frontend Client)**:
```bash
cd client
npm run dev
# Client starts at http://localhost:5173
```

---

## 🧪 Automated Testing

Run the full integration test suite covering authentication, issuance, verification, revocation, and PDF generation:
```bash
cd server
npm test
```

All 20 tests execute via Vitest and Supertest directly against the database models and Express routes.

---

## 📋 REST API Endpoints

### Authentication
- `POST /api/auth/login` — Administrator login (sets HTTP-only cookie).
- `POST /api/auth/logout` — Clear session cookie.
- `GET  /api/auth/me` — Retrieve current authenticated administrator profile.

### Public Verification
- `GET  /api/verify/:certificateId` — Public lookup of certificate status. Returns canonical record for valid certificates, revocation statement for revoked certificates, or 404 for unknown certificates.

### Certificates
- `POST /api/certificates` — Issue new certificate (Admin only).
- `GET  /api/certificates/:certificateId` — Fetch certificate details.
- `GET  /api/certificates/:certificateId/pdf` — Stream canonical printable A4 PDF.
- `GET  /api/certificates/:certificateId/qr` — Get QR code data URL and verification target.

### HR Management & Audit
- `GET   /api/admin/certificates` — Paginated certificate list with search & filters.
- `GET   /api/admin/stats` — Database aggregation analytics.
- `PATCH /api/admin/certificates/:certificateId/revoke` — Revoke certificate with mandatory audit reason.
- `GET   /api/admin/audit-logs` — Immutable append-only audit trail.

---

## 🏢 Reference Verification IDs

- `DC6E30F05C735E02` — Valid certificate issued to **Bellamkonda Jagadeesh** (Data Analytics, 6 Weeks).
- `CITS24` — Valid certificate issued to **Doppalapudi Subhash** (Data Analytics, 6 Weeks).
- `CITS-REVOKED-01` — Revoked certificate issued to **Kumar Sanjay** with compliance audit notice.
- `CV-WEB-9842` — Valid certificate issued to **Aarav Sharma** (Full-Stack MERN Development).

---

## ⚡ Deploying to Vercel & GitHub

### 1. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new) (e.g. `certiverify`).
2. Add your GitHub remote and push:
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel
1. Open the [Vercel Dashboard](https://vercel.com/new) and click **"Add New Project"**.
2. Select and import your GitHub repository.
3. Configure **Environment Variables** in the Vercel project settings:
   - `MONGODB_URI`: `mongodb+srv://saipraveenabburi7_db_user:MyEz5CrDVhuM3wsm@cluster0.tggnzrj.mongodb.net/certiverify?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `super_secure_certiverify_jwt_secret_change_in_production_2026`
   - `NODE_ENV`: `production`
4. Click **Deploy**.
   - Vercel automatically builds the frontend to `client/dist` and routes `/api/*` to the serverless function in `api/index.ts`.
   - Client-side routes (e.g. `/verify/:id`, `/admin`) are automatically routed to `index.html` via `vercel.json`.

---

## 📄 License
CODTECH IT SOLUTIONS PRIVATE LIMITED © 2026. All rights reserved.
