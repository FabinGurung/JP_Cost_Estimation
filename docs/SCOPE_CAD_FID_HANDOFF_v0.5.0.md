# JP Cost Estimation — Rate-only ownership and CAD/FID handoff v0.5.0

**Status:** Target architecture / non-destructive research proposal implemented on \`feature/rate-intelligence-only-v0.5.0-20261009\`. Not a completed CAD integration.

## 1. Ownership boundaries

| Data / operation | Sole owning subsystem | This repository's permitted role |
| --- | --- | --- |
| CAD geometry, drawings, design revisions, source elements and FIDs | CAD repository | Read validated external IDs only after interface contract |
| Drawing/model measurement, quantity takeoff, deductions, dimensional calculations and BBS | CAD repository | **No local QTO code or approximate area factors** |
| Item/technical specifications, resource catalogues, dated price observations and rate analysis | JP Cost Estimation / AEC Cost Rate Intelligence | Active responsibility |
| BOQ project line quantities and computed project totals | Later consuming integration/application | **No active BOQ calculator; blank, blocked template only** |
| Cross-company rate/source authority | AEC Cost/Rate Master | Canonical Sheet + governed Neon mirror; not frontend demo values |
| Project actual cost/payment evidence | Owning company/project | Separate finance evidence, never automatically official rates |

## 2. Active public workspaces

1. **Rate Library** — canonical \`RO-*\` observations when read-only CR-02 API actually responds; otherwise clear unavailable notice. The manually entered \`KR-*\` observations remain a separate authority class. Filter by ID, specification, unit, source and location.
2. **Rate Analysis** — explicit, manually provided resource recipe. A line equals consumption per unit of finished work × (1 + waste/100) × observed resource unit price. No hidden tax, overhead, markups, productivity or resource defaults.
3. **Sources and provenance** — authoritative source links, missingness and licence/integration status.

Historical v0.1 homeowner estimate, benchmark coefficients, 5-item BOQ and old calculation methods remain retrievable from \`main\`, previous research commits, and the named PRE snapshot; they are not active in this feature branch UI.

## 3. Proposed CAD/FID handoff schema (NOT a claim about existing CAD exports)

A CAD owner may supply a versioned, validated data object carrying:
- \`fid\`: the stable CAD feature/entity identifier in the CAD owner's namespace. Its exact semantics must be agreed with the CAD team.
- \`cad_model_id\`, \`cad_revision\` and \`source_element_fids\`
- \`work_item_id\`, engineering specification and mapped work classification
- \`measured_quantity\`, \`quantity_unit\`, \`measurement_method\`, source geometry/drawing reference
- \`source_version_or_hash\`, geometry transformation metadata where appropriate
- \`verification_status\` (must explicitly distinguish unverified, checked and approved)

No numeric value or FID is assumed to exist from this document. Do not conflate an IFC \`GlobalId\`, database record key, CAD object handle or GIS FID without a verified identity mapping.

## 4. Future BOQ population gate

A future consuming integration may populate the **blank** \`boq-template.json\` only when ALL hold:

1. CAD repository identity, export checksum and revision are verified.
2. Every imported quantity is tied to CAD FIDs and the exact original source.
3. Work-item specification and unit are compatible with a chosen approved rate-analysis result.
4. Unit conversions and item mapping are explicit and reproducible; missing/mismatched inputs are errors, not zeros.
5. Classification, inclusions, exclusions, tax, transport, waste and applicable cost additions are documented.
6. A reviewer approves population and the resulting BOQ has versioned lineage.

The rate module does not generate BOQ quantities, project totals, or construction-cost-per-square-foot estimates. The template is not an operational BOQ.

## 5. Historical sources and recovery

- Original v0.1 estimator retained in main branch.
- Previous 2026-10-09 v0.4 website snapshot: \`snapshot/pre-rate-intelligence-scope-v0.5.0-20261009\` at \`5067dada16463b26e0552dda73765591e2abbd03\`.
- Canonical AEC Master: https://docs.google.com/spreadsheets/d/1yJX1Dep0_2ZDvRftu3u-Bb6ZbDqtQWKDChQQlYCWYXY/edit
- Existing source registry in research data is retained in the prior snapshot and represented in the rate-only application.
- Changes must follow A9 governance before promotion/public deployment. No production merge, CAD wiring, or destructive cleanup is implied by this draft.
