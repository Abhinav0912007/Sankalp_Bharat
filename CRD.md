# CarbonLens CRD

## Challenge Requirement Document

## Original Problem Statement Summary

The problem statement asks for a digital intelligent platform for ESG performance and GHG monitoring. The current challenge is that organizations lack a unified system for collecting, validating, calculating, and reporting emissions data. Data is fragmented across internal teams and suppliers, creating inconsistent reporting, weak climate governance, and poor audit readiness.

The expected solution should support:
- Scope 1, Scope 2, and material Scope 3 measurement
- Centralized data collection
- Supplier engagement for Scope 3 improvement
- Governance and accountability
- Assurance-ready reporting

## Challenge Breakdown

The problem can be broken into five parts:

1. Data fragmentation
   Operational and supplier data is distributed across many sources.

2. Calculation complexity
   Emissions calculations are difficult without standardized inputs and factors.

3. Scope 3 weakness
   Supplier and value-chain emissions are the hardest to capture reliably.

4. Governance gap
   Ownership and escalation are often unclear.

5. Reporting trust gap
   Reports are hard to audit if data lineage and validation are weak.

## Core Objectives From The Brief

- Build a unified capability for Scope 1, 2, and material Scope 3 measurement
- Create a centralized and scalable data platform
- Improve supplier participation and Scope 3 data quality
- Embed climate accountability into decision-making
- Design for validation, audit trails, and reporting readiness

## Product Goal

Create a hackathon-ready MVP called `CarbonLens` that acts as a smart ESG control tower and single source of truth for ESG and GHG data for a manufacturing SME.

## Functional Goals

- Allow activity data upload and manual entry
- Calculate Scope 1 and Scope 2 emissions
- Support limited Scope 3 supplier submissions
- Validate data and flag missing or suspicious entries
- Provide dashboard-level emissions visibility
- Assign issues to owners for governance
- Generate a summary report for leadership or audit review
- Add optional AI-smart summaries after deterministic outputs are ready

## Non-Functional Goals

- Simple enough for a 24-hour hackathon
- Usable by non-technical business users
- Demoable with seeded data and minimal dependencies
- Scalable in concept, even if not enterprise-complete
- Transparent and explainable in calculations
- Modern and futuristic in presentation without making AI the core dependency

## In Scope

- Manufacturing SME use case
- Dashboard-first web application
- Scope 1 and Scope 2 coverage
- Limited Scope 3 categories through supplier portal or form
- CSV upload and manual entry
- Data quality indicators
- Governance issue tracking
- Audit-friendly summary reporting
- Optional AI-smart insights layered on top

## Out Of Scope

- Full regulatory compliance engine
- Live ERP or procurement integrations
- Real-time IoT ingestion
- Deep industry-specific emission factor coverage
- Multi-tenant enterprise setup
- Complex workflow automation
- Advanced forecasting as a core feature

## Success Criteria For Hackathon Judging

- Judges understand the problem and solution within the first minute
- The product demonstrates clear business usefulness
- The MVP feels complete, not fragmented
- The workflow is visible from data entry to emissions insight to reporting
- Scope 3 engagement is represented meaningfully
- Governance and accountability differentiate the product from a basic dashboard
- The project feels achievable and credible beyond the hackathon
- The product feels smart and modern without losing practicality

## Key Risks And Constraints

- Over-scoping the feature list
- Spending too much time on AI instead of core flows
- Weak data model leading to unclear calculations
- Poor storytelling if the UI becomes too technical
- Dependency on external APIs during demo
- Insufficient sample data for convincing reports

## Personas And Needs

## Sustainability Manager

Needs:
- One emissions dashboard
- Confidence in calculations
- Quick report generation
- Visibility into missing data
- A simple way to monitor who still needs to fix or submit data

## Operations/Admin Team

Needs:
- Simple upload and manual entry flow
- Clear validation feedback
- Fast issue resolution
- Minimal complexity in day-to-day usage

## Supplier

Needs:
- Minimal friction form
- Clear asks for required data
- Easy submission process
- A limited and realistic data request rather than a huge compliance burden

## Leadership/Board Reviewer

Needs:
- Executive summary
- Top emissions hotspots
- Risks, trends, and accountability
- Confidence that data is reliable enough for decisions
- A product experience that feels modern, concise, and decision-friendly
