# CarbonLens Work Done Tracker

This document tracks the cleaned and current project direction.

## Completed

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
* **[2026-04-17]** ✅ **[Sparsh — Phase 1] UI Foundation**: Established the 'Control Tower' visual standard using MUI custom theme (`carbonLensTheme.ts`), Inter font family, dark slate + emerald accent palette, global CSS with micro-animations, and responsive `AppLayout` with collapsible sidebar navigation.
* **[2026-04-17]** ✅ **[Sparsh — Phase 1] High-Performance Data Grid**: Built reusable `CarbonDataGrid` component on `@tanstack/react-table` with server-side pagination (25/50/100 rows), global search, expandable rows, column headers, loading skeletons, and empty states. `RecordsPage` renders up to 1,000 emission records dynamically from `GET /api/records`. Zero hardcoded data.
* **[2026-04-17]** ✅ **[Sparsh — Phase 2] Manual Entry Flow**: Built dynamic `ManualEntryPage` form using `react-hook-form` + Zod validation. Form toggles activity unit (Liters/kWh/km/kg), emission scope (Scope 1/2/3), and category based on source type selection (Diesel, Electricity, Travel, Waste, etc.). Facilities fetched from `GET /api/facilities`. Submissions via `POST /api/records/manual`.
* **[2026-04-17]** ✅ **[Sparsh — Phase 2] Governance UI**: Constructed Governance Review grid with nested expandable rows showing linked record details, inline 'Approve' and 'Flag' action buttons (calling `POST /api/issues/:id/status`), assign dialog (calling `POST /api/issues/:id/assign`), status filters, and snackbar notifications. All data from `GET /api/issues`.

## Current Status

- Documentation is aligned and product direction is stable
- Sparsh's Phase 1 & 2 frontend tasks are complete — awaiting backend integration for live data

## Removed or Simplified

- OCR-first ingestion assumptions from MVP scope
- Massive Scope 3 expectations from early planning
- Overly enterprise-heavy branch/task structure
- Duplicate README variants not needed for the project

## Next Recommended Work

1. Finalize the canonical tech stack in docs
2. Create implementation scaffolding
3. Seed demo data
4. Build core flows in this order:
   - auth
   - data entry/upload
   - calculation engine
   - dashboard
   - governance
   - report summary
   - AI-smart summary layer
