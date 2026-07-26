# JP Construction Estimation System (JP-CES) v0.1

## Purpose
A civilian-facing building cost estimator. The homeowner answers simple questions; the backend translates them into engineering quantities and BOQ items.

## How to run
1. Keep `index.html`, `styles.css`, `data.js`, and `app.js` in the same folder.
2. Double-click `index.html`.
3. No server, installation, or internet connection is required.

## What is working in v0.1
- 8-step homeowner questionnaire
- Kumari Gurung example preset
- Built-up area calculation
- Benchmark engineering quantity engine
- Activated BOQ line items
- Cost-by-category summary
- Simple and Engineer BOQ views
- Engineer/Admin rate editor
- Export project estimate to JSON
- Print / Save as PDF from browser

## Important
The rates in `data.js` are DEMO values only. They are intentionally separated from the calculation engine so an engineer/admin can replace them with dated, approved local rates without changing the front-end questions.

The structural quantities are benchmark-based. This is a planning estimator, not a structural design or tender BOQ.

## Recommended next versions
### v0.2
- Replace demo rates with a Pokhara rate library with source/date/vendor metadata
- Add exact 35-question schema with conditional branching
- Add room-by-room area editor
- Add opening schedule
- Add wall-length estimator
- Add rate profiles by finish grade

### v0.3
- Architectural plan upload/extraction workflow
- Structural drawing input
- BBS engine
- MEP quantities
- Quantity traceability to source drawing

### v1.0
- Project accounts
- Saved projects
- Vendor quotations
- Procurement
- Progress billing
- Variation orders
- Client PDF report
- Engineer audit trail
