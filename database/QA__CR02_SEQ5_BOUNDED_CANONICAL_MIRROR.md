# A9 CR-02 Seq5 — bounded canonical data mirror QA

Status: **PRODUCTION DATA MIRROR READBACK PASS**

Canonical authority remains the Drive workbook `AEC_Cost_Rate_Master_v1.0` (Drive ID `1yJX1Dep0_2ZDvRftu3u-Bb6ZbDqtQWKDChQQlYCWYXY`).

## Production counts after Seq5
- sources: 1
- locations: 2
- work_items: 1
- materials: 5
- rate_observations: 4
- rate_analysis: 2
- rate_analysis_sources: 0
- rate_analysis_components: 5
- identifier_aliases: 1

Legacy public-layer counts remained:
- source_documents: 5
- rate_books: 1
- rate_items: 0

## Mirrored rate observations
- RO-1468 — MAT-CEMENT-OPC — NPR 708/bag — LOC-0003
- RO-1482 — MAT-CRUSHER-SAND — NPR 2,877/m³ — LOC-0002
- RO-1508 — MAT-RMC-M20 — NPR 12,500/m³ — LOC-0002
- RO-1514 — MAT-REBAR-FE500-TORSTEEL-10-20MM — NPR 91/kg — LOC-0003

## Source correction preserved
The canonical Drive rows RAC-0001 through RAC-0005 have blank `Rate_Observation_ID`.
Production therefore preserves `rate_observation_id = NULL` for all five components.
Earlier temporary-test bindings were not promoted.

## Known gap
`MAT-GETTI-10-16` exists canonically, but no exact canonical `RO-*` was resolved in the bounded live search. No substitute rate was invented.

## Namespace reconciliation
Legacy public research ID `SRC-KASKI-2083-84` is retained and mapped through `cr02.identifier_aliases` to canonical `SRC-0005`. No legacy row was deleted or rewritten.

## Safety
The data mirror was executed as one production SQL transaction after a Drive PRE checkpoint and an exact empty-state pre-read.
A Neon pre-branch attempt failed with provider HTTP 401 before branch creation; this was recorded in the PRE and production remained unchanged until the atomic transaction.
