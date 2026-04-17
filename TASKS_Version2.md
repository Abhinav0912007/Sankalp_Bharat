# CarbonLens Task Plan

This document translates the final CarbonLens direction into a practical hackathon execution plan.

## Final Product Direction

- Audience: manufacturing SMEs
- Primary identity: operations and governance
- Supporting outcome: reporting readiness
- AI role: smart summaries and recommendations only
- Scope 3: limited and realistic

---

## Phase Plan

### Phase 1: Foundations
- Set up app project and environments
- Configure authentication and roles
- Define database schema
- Seed demo organization, facilities, suppliers, and records

### Phase 2: Core Data Flow
- Build manual data entry flow
- Build CSV upload flow
- Implement Scope 1 and Scope 2 calculations
- Add limited Scope 3 supplier submission

### Phase 3: Governance and Reporting
- Add validation rules and issue generation
- Build governance issue board
- Build dashboard summaries and trends
- Build report-ready summary page

### Phase 4: Smart Layer and Polish
- Add AI-smart summaries on top of calculated data
- Improve visual polish and storytelling
- Test full demo flow
- Prepare fallback demo path

---

## Suggested Team Split

### Backend / Data
- Authentication
- Database schema
- Calculation logic
- Validation and issue creation
- Report and insight APIs

### Frontend / Product
- Layout and navigation
- Dashboard
- Upload and manual entry UI
- Supplier submission flow
- Governance and reporting screens

### Shared
- Seed data
- Demo flow
- Testing
- Pitch assets

---

## Work Breakdown

### Authentication and Roles
- Login flow
- Protected routes
- Role-aware views

### Data Model
- Organization
- Facility
- ActivityRecord
- EmissionFactor
- Supplier
- SupplierSubmission
- Issue
- Report

### Data Input
- Manual entry form
- CSV upload with validation

### Calculations
- Scope 1 calculation service
- Scope 2 calculation service
- limited Scope 3 aggregation

### Governance
- Validation rules
- Issue generation
- Owner assignment
- Status tracking

### Dashboards
- Total emissions by scope
- Emissions by facility
- Trend view
- Supplier status view
- Open issues summary

### Reporting
- Summary page
- Printable/export-friendly layout

### AI-Smart Layer
- Emission summary text
- Suggested next actions
- Risk explanation cards

---

## Priority Order

### Must Have
- Auth
- Data model
- Manual entry
- CSV upload
- Scope 1 and Scope 2 calculations
- Supplier submission
- Issue tracking
- Dashboard
- Report summary

### Should Have
- Better trend charts
- Cleaner validation UX
- AI-smart summary panel

### Could Have
- Scenario snapshot
- Better exports
- Enhanced supplier nudges

---

## What We Are Not Building First

- OCR ingestion
- Image and PDF extraction
- Massive Scope 3 ingestion
- Multi-branch overcomplicated split
- Heavy enterprise workflow modeling
- Advanced forecasting
