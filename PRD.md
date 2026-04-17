# Product Requirements Document
## CarbonLens

**Version:** 2.0  
**Status:** Active  
**Owner:** Product / Hackathon Team  
**Last Updated:** 2026-04-17

---

## 1. Overview

### 1.1 Problem Statement
Manufacturing SMEs struggle with ESG and GHG reporting because data is scattered across operations, finance, procurement, and suppliers. Manual collection is slow, error-prone, and difficult to audit. Leadership often lacks a trusted source of truth for emissions visibility and accountability.

### 1.2 Product Vision
Build a smart ESG control tower for manufacturing SMEs that helps teams collect emissions-related data, validate it, calculate emissions, track accountability, and generate trusted sustainability summaries.

### 1.3 Product Goal
Provide a practical MVP that centralizes Scope 1 and Scope 2 reporting, supports limited and realistic Scope 3 supplier input, and adds governance and AI-smart insight layers on top of deterministic calculations.

---

## 2. Objectives

### Primary Objectives
1. Centralize ESG and GHG activity data into one trusted system.
2. Calculate Scope 1 and Scope 2 emissions reliably.
3. Support limited Scope 3 supplier engagement for high-impact categories.
4. Make missing or low-quality data visible and actionable.
5. Generate concise leadership-ready and audit-friendly reporting outputs.

### Business Outcomes
- Reduce manual data collection effort
- Improve data consistency and reporting trust
- Increase visibility into ownership and unresolved issues
- Give leadership a simple sustainability snapshot
- Show a realistic path from hackathon MVP to real product

---

## 3. Users and Personas

### 3.1 Sustainability Manager
- Reviews emissions status
- Tracks data quality and unresolved issues
- Generates summaries for leadership

### 3.2 Operations/Admin User
- Uploads or enters facility/activity data
- Resolves validation issues
- Maintains reporting inputs

### 3.3 Supplier User
- Submits limited Scope 3 data
- Responds to simple, guided requests

### 3.4 Leadership / Board Reviewer
- Views emissions summary, hotspots, and risk indicators
- Consumes report-ready output

---

## 4. Scope

### 4.1 In Scope for MVP
- User authentication and role-based access
- Organization, facility, and supplier setup
- Activity data capture through manual entry and CSV upload
- Scope 1 and Scope 2 calculation engine
- Limited Scope 3 supplier submission flow
- Data validation and issue generation
- Dashboard for emissions, trends, and issue visibility
- Governance view for ownership and escalation
- Summary report generation
- Optional AI-smart summaries based on already-calculated outputs

### 4.2 Out of Scope for MVP
- OCR ingestion for PDFs and images
- Massive Scope 3 modeling
- Full regulatory automation
- ERP integrations
- Real-time IoT feeds
- Advanced forecasting as a core feature
- Deep multi-entity enterprise workflows

---

## 5. Functional Requirements

### 5.1 User Management and Access Control
- Users must authenticate securely.
- The system must support role-based access control.
- Roles should include at least:
  - Sustainability Manager
  - Operations/Admin
  - Supplier
  - Leadership Viewer

### 5.2 Organization Setup
- Users must be able to configure:
  - organization
  - facilities
  - suppliers
  - reporting periods

### 5.3 Data Collection
- Users must be able to manually enter activity data.
- The platform must accept CSV uploads.
- Each record should store source, owner, timestamp, and validation status.

### 5.4 Emissions Calculation
- The platform must calculate:
  - Scope 1 emissions
  - Scope 2 emissions
  - selected Scope 3 emissions
- Calculations must use configurable emission factors.
- Calculation logic must remain deterministic and traceable.

### 5.5 Scope 3 Supplier Engagement
- The platform must support a simple supplier submission flow.
- Scope 3 should remain limited to a few practical categories.
- Supplier responses must be tracked by status:
  - not requested
  - requested
  - submitted
  - validated
  - rejected

### 5.6 Validation and Governance
- Required fields and suspicious values must be flagged.
- Issues must be assignable to an owner.
- Governance views must show unresolved items clearly.

### 5.7 Reporting and Dashboards
- The platform must provide dashboards for:
  - total emissions by scope
  - emissions by facility
  - trends over time
  - supplier submission status
  - open issues
- Users must be able to generate a concise summary report.

### 5.8 AI-Smart Insight Layer
- The system may generate summaries and recommendations only after deterministic calculations are complete.
- AI must not be the source of truth for calculations or compliance claims.

---

## 6. Non-Functional Requirements

### 6.1 Simplicity
- The product should remain understandable and demoable within a hackathon.

### 6.2 Security
- Role-based access control
- Secure authentication and session handling

### 6.3 Auditability
- Every reported value must be traceable to source data
- Issues and status changes must be visible

### 6.4 Scalability
- Architecture should support future growth to more facilities, suppliers, and categories

### 6.5 Usability
- Interface should be simple for non-technical users
- Data entry and issue resolution should be efficient

---

## 7. Success Metrics

- Reduction in manual data reconciliation
- Percentage of records captured in standardized format
- Time taken to create a leadership-ready summary
- Number of unresolved data issues over time
- Supplier response rate for selected Scope 3 categories
- Demo clarity and completeness for hackathon judging

---

## 8. Assumptions

- The company has access to internal facility/activity data.
- Emission factors are available from trusted sources.
- Initial product story focuses on manufacturing SMEs.
- Scope 3 is intentionally limited for MVP credibility.

---

## 9. Risks and Mitigations

### Risk: Scope creep
**Mitigation:** Keep the MVP focused on operations and governance first.

### Risk: Weak demo story
**Mitigation:** Preserve a clear flow from input to calculation to issue tracking to reporting.

### Risk: Scope 3 complexity
**Mitigation:** Support only limited, high-impact supplier categories.

### Risk: AI instability
**Mitigation:** Keep AI optional and layered on top of deterministic outputs.

---

## 10. MVP Release Criteria

The MVP is successful when:
- Users can log in
- Activity data can be entered or uploaded
- Scope 1 and Scope 2 emissions are calculated correctly
- Limited Scope 3 supplier input is supported
- Validation issues are created and tracked
- Dashboards show consolidated emissions and governance status
- Leadership can view a concise summary report

---

## 11. Future Enhancements
- Broader Scope 3 category coverage
- Better scenario planning
- ERP integrations
- Advanced AI-assisted issue detection
- Multi-entity scaling
- Stronger audit workflows
