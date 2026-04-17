# CarbonLens

`CarbonLens` is a documentation-first hackathon project for `SKB_P1: Digital Intelligent Platform for ESG Performance and GHG Monitoring`.

It is designed as a simple, practical, and impactful ESG control tower for manufacturing SMEs. The concept focuses on giving companies one trusted place to collect emissions-related data, calculate Scope 1 and Scope 2 emissions, manage limited Scope 3 supplier inputs, track governance issues, and generate trusted sustainability summaries.

## Problem We Are Solving

Most organizations still manage ESG and GHG reporting through scattered spreadsheets, emails, and supplier follow-ups. That creates:

- fragmented and inconsistent emissions data
- slow, manual, error-prone reporting
- weak visibility for leadership and board-level decisions
- poor audit readiness and unclear accountability

CarbonLens addresses this by acting as a single source of truth for ESG and GHG data, while making accountability and follow-up part of the workflow.

## Project Direction

- Target users: Sustainability Manager, Operations/Admin team, Supplier, Leadership/Board reviewer
- Primary audience: manufacturing SMEs
- Positioning: smart ESG control tower for carbon visibility, accountability, and simple decision support
- Hackathon strategy: build a focused operations-first MVP with strong demo value instead of a broad enterprise platform

## Planned MVP

- Activity data upload and manual entry
- Scope 1 and Scope 2 emissions calculation
- Limited Scope 3 supplier submission flow
- Data quality validation and issue detection
- Governance dashboard with ownership and escalation
- Summary reporting for leadership and audit readiness
- Optional AI-smart insights layered on top of deterministic calculations

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Charts: Recharts
- Backend: Node.js + Express + TypeScript
- Database: SQLite + Prisma
- Auth: simple seeded demo auth
- AI add-on: optional OpenAI narrative summaries

## Product Identity

- Core: operations and governance
- Supporting outcome: reporting readiness
- Enhancement layer: AI-smart summaries and insights
- Scope 3 strategy: limited, realistic, and supplier-focused

## Repository Docs

- `idea.md` : ideation, concept comparison, final selected idea
- `CRD.md` : challenge breakdown, scope, goals, risks, personas
- `Design.md` : UX flows, screen plan, wireframe notes, visual direction
- `Getting_Started.md` : planned setup, stack, env vars, demo accounts
- `quick-reference.md` : fast summary for hackathon use
- `rules.md` : build discipline and timeboxing rules
- `next-steps.md` : post-hackathon roadmap
- `implementation-pan.md` : implementation blueprint and 24-hour execution plan
- `progress.md` : working status tracker
- `demo-script.md` : 3 to 5 minute judge demo flow
- `data-model.md` : entities and relationships
- `api-contract.md` : planned API endpoints and payloads
- `pitch-notes.md` : pitch framing and talking points

## Demo Story

The demo should show a clear end-to-end flow:

1. A sustainability user opens the dashboard and sees the organization's emissions snapshot.
2. An operations user uploads new activity data and the platform validates it.
3. A supplier submits limited Scope 3 data through a simple form.
4. CarbonLens flags issues, assigns accountability, and updates the organization view.
5. Leadership generates a concise report-ready summary.

## Key Principles

- Keep calculations deterministic and explainable
- Use AI only as an assistive layer, not the source of truth
- Prefer seeded demo data over risky live dependencies
- Optimize for a clean, credible 3 to 5 minute hackathon demo
- Keep the product grounded in real business pain and practical adoption
