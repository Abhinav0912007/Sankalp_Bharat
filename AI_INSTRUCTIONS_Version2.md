# AI Instructions
## CarbonLens

**Version:** 2.0  
**Status:** Active  
**Last Updated:** 2026-04-17

---

## 1. Purpose

This file defines how AI-assisted development should behave for CarbonLens.

---

## 2. Core Rules

### 2.1 Follow The Current Documents
Before generating or modifying code, follow:
- `readme.md`
- `PRD.md`
- `CRD.md`
- `ARCHITECTURE_Version2.md`
- `TASKS_Version2.md`
- `TEST_PLAN_Version2.md`
- `rules.md`

### 2.2 Do Not Invent Scope
- Do not add OCR ingestion to MVP
- Do not expand Scope 3 beyond the agreed limited set
- Do not make AI the source of truth
- Do not add enterprise-heavy workflows unless explicitly requested

### 2.3 Keep The Product Practical
- Prefer simple and buildable architecture
- Preserve the manufacturing SME focus
- Keep operations and governance as the product core

---

## 3. Project-Specific Constraints

- Calculations must be deterministic and traceable
- AI may summarize, explain, or recommend only after real metrics exist
- Validation and governance must remain visible
- Supplier workflow must stay lightweight
- Reporting must be concise and demo-friendly

---

## 4. Preferred Development Order

1. Setup and authentication
2. Data model
3. Data entry and upload
4. Calculations
5. Dashboard
6. Supplier flow
7. Governance and issues
8. Report summary
9. AI-smart summary layer
