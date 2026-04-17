# CarbonLens Work Done Tracker

This document tracks completed work per team member with timestamps.

---

## Completed — Project Setup & Planning

* **[2026-04-17]** Finalized product identity as a smart ESG control tower for manufacturing SMEs.
* **[2026-04-17]** Locked the product positioning to operations and governance first.
* **[2026-04-17]** Kept AI as a supporting layer rather than the system core.
* **[2026-04-17]** Restricted Scope 3 to a limited and realistic MVP.
* **[2026-04-17]** Created and aligned the main project docs around CarbonLens.
* **[2026-04-17]** Cleaned conflicting documentation that had pushed OCR-heavy and oversized MVP scope.
* **[2026-04-17]** Updated README, idea, CRD, PRD, architecture, task plan, and pitch notes for one consistent story.
* **[2026-04-17]** Generated all core planning documents: `PRD.md`, `ARCHITECTURE_Version2.md`, `CRD.md`, `TASKS_Version2.md` and `implementation-pan.md`.
* **[2026-04-17]** Finalized Team Allocation allocating 6 members explicitly across Backend and Frontend tasks (Sameera, Sahiti, Jiya, Atharva, Sparsh, Harsh).
* **[2026-04-17]** Flushed earlier mock boilerplate code repositories (`frontend` and `backend` directories) to establish a clean slate.

---

## Atharva — Frontend

### Phase 1 ✅ `2026-04-17 ~21:30 IST`

- Scaffolded Vite + React + TypeScript frontend (`/frontend`)
- Configured path aliases: `@/` → `src/`, `@shared/` → `../shared/`
- Vite proxy: `/api/*` → `http://localhost:5000`
- React Router with `ProtectedRoute` wrapper (redirects to `/login` if unauthenticated)
- Zustand `useAuthStore` with localStorage persistence — stores token, user, isAuthenticated
- Axios instance in `lib/api.ts` — auto-attaches `Authorization: Bearer {token}` on every request, auto-logouts on 401
- `LoginPage.tsx` — dark glassmorphism card, animated background orbs, shake-on-error animation
- `AppLayout.tsx` — fixed sidebar, CarbonLens logo, nav links with active states, user avatar initials, logout button
- `UploadPage.tsx` — drag-and-drop zone, file validation, progress bar, result stat cards
- `DashboardPage.tsx` — 4 metric card shells (Total Emissions, Data Quality, Open Issues, Suppliers)
- `index.css` — 893-line design system: dark palette, CSS custom properties, glassmorphism, micro-animations, responsive rules

### Phase 2 ✅ `2026-04-17 ~22:30 IST`

- `ManualEntryPage.tsx` — 7 source type selector cards with emoji icons and Scope badges
- Dynamic form: units, categories, and default scope change based on selected source type
- Source types: Fuel Combustion (🔥), Electricity (⚡), Steam/Heating (♨️), Process Emissions (🏭), Transportation (🚛), Waste Disposal (♻️), Water Treatment (💧)
- Facility ID field, Category dropdown, Scope selector, Activity Value + Unit, Period Month/Year
- Submit sends `ManualRecordRequest` to `POST /api/records/manual`
- Success result shows: recordId, calculatedEmissions (tCO₂e), status badge
- `/manual-entry` route added to router and sidebar nav
- CSS added for: `.entry-type-grid`, `.entry-type-card`, `.entry-fields-grid`, `.entry-result`, `.form-select`, skeleton loaders

### Build Verification ✅ `2026-04-17 22:37 IST`

- Fixed TS6 `erasableSyntaxOnly` errors: all enums converted to `const object + type union`
- Fixed `baseUrl` deprecation (TS6): removed `baseUrl`, paths work from tsconfig location
- `tsc --noEmit`: **0 errors**
- `npm run build`: **0 errors**, 297.61 kB JS bundle, 18.88 kB CSS, in 253ms

---

## Sameera — Backend

### Phase 1 ✅ `2026-04-17 ~23:45 IST`

- Scaffolded Express + TypeScript backend (`/backend`) on port 5000
- Prisma schema with 9 entities in SQLite:
  - Organization, User, Facility, EmissionFactor, EmissionRecord
  - Supplier, SupplierSubmission, Issue, Report
- `GET /health` — server health check
- `POST /api/auth/login`:
  - Finds user by email, bcrypt compares password
  - Constant-time comparison even for missing users (timing attack prevention)
  - Returns exactly: `{ token, user: { id, orgId, role, name } }` — Atharva's contract
  - JWT signed with `userId`, `orgId`, `role` in payload — Jiya/Sahiti extract `orgId` from this
- `multer` middleware — accepts PDF, PNG, JPG, XLSX, CSV; 20 MB max size; disk storage with timestamp filenames
- File parser service (`/services/fileParser.ts`):
  - CSV → `csv-parse` library
  - XLSX → `xlsx` library (sheet_to_json)
  - PDF → `pdf-parse` + regex heuristic (number + unit extraction)
  - Image → empty array (Tesseract.js hook point)
  - All output: `ParsedActivityItem[] = [{ activityType, value, unit }]`
- `EmissionEngine` stub (`/services/emissionEngine.ts`):
  - `processBatch(items, orgId)` — Sahiti replaces body with DB factor lookups + CO2e math
  - `calculateSingle(item, orgId)` — Sahiti replaces body
- `POST /api/records/upload` — multer → fileParser → processBatch → response
- `POST /api/records/manual` — validate → facility org check → calculateSingle → persist EmissionRecord
- `GET /api/records` — org-scoped, filterable by scope/facilityId/status
- Stub routes ready for Jiya: dashboard summary/trends, suppliers, reports

### Phase 2 ✅ `2026-04-17 ~23:55 IST`

- `authenticateToken` middleware:
  - Reads `Authorization: Bearer {token}` header
  - Verifies JWT against `JWT_SECRET`
  - Attaches decoded payload to `req.user` (`userId`, `orgId`, `role`)
  - Returns 401 with distinct messages for missing token / expired token / invalid token
- `POST /api/issues` — creates issue linked to a recordId and recordType
- `GET /api/issues` — org-scoped list with optional `?status=` and `?severity=` filters
- `POST /api/issues/:id/assign` — assigns ownerUserId, auto-sets status to IN_PROGRESS
- `POST /api/issues/:id/status` — updates issue lifecycle status (OPEN/IN_PROGRESS/RESOLVED/CLOSED)

### Phase 3 ✅ `2026-04-17 ~23:55 IST`

- `restrictToRole(['ADMIN'])` RBAC middleware factory
- Applied to: `DELETE /api/issues/:id`, `POST /api/reports/generate`, `GET /api/organizations/users`
- Returns `403 Forbidden` with role requirement message if role not allowed

### Database + Tests ✅ `2026-04-17 23:58 IST`

- `prisma db push` — SQLite `dev.db` created and schema synced
- `npm run db:seed` — seeded:
  - 1 org (Bharat Steel Manufacturing Pvt. Ltd.)
  - 3 users with bcrypt hashed passwords
  - 2 facilities (Pune Manufacturing Plant, Mumbai Warehouse)
  - 6 IPCC-aligned emission factors (diesel 2.68, electricity India 0.716 kg CO2e/kWh, etc.)
  - 2 suppliers
- Live API tests passed:
  - `GET /health` → `{ status: "ok" }`
  - `POST /api/auth/login` (correct) → JWT + user object ✅
  - `POST /api/auth/login` (wrong password) → `401 Invalid email or password` ✅
  - `GET /api/facilities` with Bearer token → 2 facilities returned ✅
- TypeScript build: **0 errors**

---

## Sparsh — Dashboard UI

### Phase 1 ✅ `2026-04-17`

- ✅ **UI Foundation**: Established the 'Control Tower' visual standard using MUI custom theme (`carbonLensTheme.ts`), Inter font family, dark slate + emerald accent palette, global CSS with micro-animations, and responsive `AppLayout` with collapsible sidebar navigation.
- ✅ **High-Performance Data Grid**: Built reusable `CarbonDataGrid` component on `@tanstack/react-table` with server-side pagination (25/50/100 rows), global search, expandable rows, column headers, loading skeletons, and empty states. `RecordsPage` renders up to 1,000 emission records dynamically from `GET /api/records`. Zero hardcoded data.

### Phase 2 ✅ `2026-04-17`

- ✅ **Manual Entry Flow**: Built dynamic `ManualEntryPage` form using `react-hook-form` + Zod validation. Form toggles activity unit (Liters/kWh/km/kg), emission scope (Scope 1/2/3), and category based on source type selection (Diesel, Electricity, Travel, Waste, etc.). Facilities fetched from `GET /api/facilities`. Submissions via `POST /api/records/manual`.
- ✅ **Governance UI**: Constructed Governance Review grid with nested expandable rows showing linked record details, inline 'Approve' and 'Flag' action buttons (calling `POST /api/issues/:id/status`), assign dialog (calling `POST /api/issues/:id/assign`), status filters, and snackbar notifications. All data from `GET /api/issues`.

### Phase 3: Pending

- Recharts Line graph and Donut chart wired to `GET /api/dashboard/summary`
- Wire metric cards to live API data (replace `—` placeholders)

---

## Jiya — Analytics API

### Status: Not started

**Assigned tasks (Phase 1):**
- `seed.ts` — bulk 1000 randomized Scope 3 validation records spanning 6 months
- System CRUD APIs: `GET/POST /api/organizations`, `GET/POST /api/facilities`

**Assigned tasks (Phase 2):**
- `POST /api/supplier/submit` — external supplier portal with hash-token auth
- Unique hash generation for unauthenticated supplier URLs

**Assigned tasks (Phase 3):**
- Optimized `GROUP BY` queries for `/api/dashboard/summary` and `/api/dashboard/trends`
- Replace stub dashboard routes with real aggregation logic

---

## Harsh — Supplier UI + Settings

### Status: Not started

**Assigned tasks (Phase 1):**
- Settings screen with react-hook-form + Zod validation
- Payloads for Jiya's Master Data APIs

**Assigned tasks (Phase 2):**
- Supplier submission portal (public-facing, no sidebar)

**Assigned tasks (Phase 3):**
- Global Axios response interceptor → Toaster alerts on ≥400 errors

---

## Removed or Out of Scope

- OCR-first ingestion (replaced with structured CSV/XLSX upload)
- Massive Scope 3 pipeline
- Multi-branch overcomplicated structure
- Heavy enterprise workflow modeling
- Image OCR (Tesseract.js hook available but not wired)
