# Architecture Document
## CarbonLens

**Version:** 2.0  
**Status:** Active  
**Last Updated:** 2026-04-17

---

## 1. Purpose

This document defines the high-level architecture for CarbonLens, a smart ESG control tower for manufacturing SMEs. The architecture is designed to stay simple enough for a hackathon MVP while remaining realistic and scalable.

---

## 2. Architecture Goals

- Provide a single source of truth for ESG and GHG data
- Support Scope 1, Scope 2, and limited Scope 3 emissions
- Keep calculations deterministic and traceable
- Make governance and issue ownership visible
- Enable simple reporting and AI-smart summaries
- Stay lightweight enough for rapid implementation

---

## 3. High-Level System Overview

The platform is organized into the following layers:

1. **Presentation Layer**
   - Web dashboard
   - Data upload and manual entry screens
   - Supplier submission page
   - Governance and reporting views

2. **Application Layer**
   - Activity data management
   - Emissions calculation engine
   - Validation and issue engine
   - Supplier submission workflow
   - Reporting and AI summary service

3. **Data Layer**
   - Relational database for structured ESG data
   - File storage for uploads and exports

4. **Supporting Layer**
   - Authentication and role access
   - Audit metadata
   - Optional background processing for imports and reports

---

## 4. Recommended Technology Stack

### App Layer
- Next.js
- TypeScript

### UI Layer
- Tailwind CSS
- shadcn/ui
- Recharts

### Data Layer
- Supabase Postgres
- Supabase Auth
- Supabase Storage

### Validation and Logic
- Zod for input validation
- TypeScript service layer for emissions calculations

### AI Layer
- OpenAI API for summaries and recommendations only

### Deployment
- Vercel for app hosting
- Supabase for database, auth, and storage

---

## 5. Core Modules

### 5.1 Identity and Access
Responsibilities:
- Authenticate users
- Enforce role-based access
- Separate admin, operations, supplier, and leadership views

Roles:
- Sustainability Manager
- Operations/Admin
- Supplier
- Leadership Viewer

### 5.2 Organization and Master Data
Responsibilities:
- Manage organizations, facilities, suppliers, and reporting periods

Core entities:
- Organization
- Facility
- Supplier
- ReportingPeriod

### 5.3 Activity Data Module
Responsibilities:
- Capture raw activity data
- Support manual entry and CSV upload
- Track source, owner, and status

Examples:
- Fuel consumption
- Purchased electricity
- Transport
- Waste
- Supplier-submitted Scope 3 data

### 5.4 Emissions Calculation Engine
Responsibilities:
- Apply emission factors
- Calculate Scope 1 and Scope 2 reliably
- Support limited Scope 3 categories
- Store calculated outputs and traces

### 5.5 Supplier Module
Responsibilities:
- Track supplier requests and submissions
- Support simple guided submission flow
- Show status and completeness

### 5.6 Validation and Governance Module
Responsibilities:
- Validate required fields
- Flag suspicious or incomplete records
- Create assignable issues
- Track resolution status

### 5.7 Reporting and Dashboard Module
Responsibilities:
- Show emissions summary and trends
- Show issue and supplier status
- Generate concise report-ready output

### 5.8 AI Insight Module
Responsibilities:
- Turn validated metrics into readable summaries
- Suggest next actions
- Explain major drivers and unresolved risks

Constraint:
- AI does not calculate emissions

---

## 6. Data Architecture

### 6.1 Primary Database
Use Postgres for structured storage of:
- users
- organizations
- facilities
- activity records
- emission factors
- calculations
- suppliers
- submissions
- issues
- reports

### 6.2 Storage
Store:
- uploaded CSVs
- exported reports
- optional evidence files

---

## 7. Core Data Model

### Main Entities
- User
- Organization
- Facility
- ActivityRecord
- EmissionFactor
- EmissionResult
- Supplier
- SupplierSubmission
- Issue
- Report

### Relationships
- An organization has many facilities, suppliers, users, records, and reports
- A facility has many activity records
- Activity records map to emission factors
- Suppliers submit limited Scope 3 data
- Issues connect to records or submissions

---

## 8. API Architecture

Recommended route groups:
- `/auth`
- `/dashboard`
- `/records`
- `/suppliers`
- `/issues`
- `/reports`
- `/insights`

Principles:
- clean request and response formats
- role-aware access
- traceable identifiers
- validation before write operations

---

## 9. Workflow Flows

### 9.1 Data Collection Flow
1. User uploads CSV or enters manual data
2. System validates inputs
3. Data is stored with metadata
4. Issues are created if validation fails
5. Valid records flow into calculation logic

### 9.2 Calculation Flow
1. Select activity records
2. Retrieve matching emission factors
3. Calculate emissions
4. Store result and traceability metadata
5. Refresh dashboards and reports

### 9.3 Supplier Flow
1. Request supplier input
2. Supplier submits limited data
3. System validates submission
4. Validated data contributes to Scope 3 view

### 9.4 Reporting Flow
1. Select reporting period
2. Gather validated metrics
3. Compile summary and charts
4. Optionally generate AI summary text
5. Display report-ready output

---

## 10. Security Architecture

- Secure login and session handling
- Role-based authorization
- Validation on all write operations
- Protected uploads
- Traceability for changes affecting ESG data

---

## 11. Scalability Considerations

The platform should scale through:
- modular service boundaries
- Postgres-backed structured data
- optional background processing for imports and reports
- future expansion of Scope 3 categories
- future multi-facility and multi-organization growth

---

## 12. Reliability and Traceability

- Preserve source records
- Store calculation metadata
- Keep issue history visible
- Keep report generation tied to validated data
- Keep AI summaries downstream from trusted calculations
