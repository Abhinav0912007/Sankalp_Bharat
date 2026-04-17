# Test Plan
## CarbonLens

**Version:** 2.0  
**Status:** Active  
**Last Updated:** 2026-04-17

---

## 1. Test Objectives

- Verify secure access
- Validate data entry and CSV upload
- Confirm Scope 1 and Scope 2 calculations
- Confirm limited Scope 3 supplier flow
- Verify issue generation and governance states
- Verify report summary output
- Verify AI-smart summaries stay downstream from real calculations

## 2. In Scope

- Authentication and authorization
- Facility and supplier setup
- Manual entry
- CSV upload
- Validation rules
- Issue tracking
- Scope 1 and Scope 2 calculations
- Limited Scope 3 submission
- Dashboard summaries
- Report summary generation

## 3. Out Of Scope

- OCR ingestion
- Massive Scope 3 coverage
- Advanced AI model behavior
- Enterprise-scale performance testing

## 4. Key End-To-End Scenarios

### Scenario 1: Manual Entry To Dashboard
1. User logs in
2. User enters activity data
3. Data is validated
4. Emissions are calculated
5. Dashboard updates

### Scenario 2: CSV Upload To Issue Creation
1. User uploads CSV
2. Invalid rows are flagged
3. Issues are created where needed
4. Governance page shows unresolved items

### Scenario 3: Supplier Submission To Scope 3 View
1. Supplier submits limited Scope 3 data
2. Submission is validated
3. Status updates
4. Dashboard reflects supplier contribution

### Scenario 4: Report Summary
1. User selects reporting period
2. App gathers calculated metrics and issue status
3. Report summary is generated
4. Optional AI summary is shown on top
