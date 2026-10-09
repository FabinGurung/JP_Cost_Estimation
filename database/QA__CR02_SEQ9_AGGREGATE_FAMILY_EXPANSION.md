# A9 CR-02 Seq9 — bounded aggregate-family expansion QA

Status: **PRODUCTION READBACK PASS**

## Canonical source
- Master: AEC_Cost_Rate_Master_v1.0
- Source: SRC-0005 — Kaski District Rate FY 2083/84
- Total canonical SRC-0005 observations in live Drive master: **973**

## Pre-state
- cr02.materials: 5
- cr02.rate_observations: 4
- target aggregate materials present: 0
- target aggregate observations present: 0

## Rollback snapshot / test
- Neon branch: `br-holy-field-b3pjn81b`
- Test insert: PASS
- Test readback: 5 target materials + 5 target observations
- Snapshot compute suspended after QA; branch retained.

## Production insert
Mirrored:
- RO-1484 — MAT-GETTI-RIVER-SCREENED-WASHED — NPR 2,054/m³
- RO-1485 — MAT-GETTI-CRUSHED-4.75-40 — NPR 2,107/m³
- RO-1486 — MAT-GETTI-CRUSHED-4.75-25 — NPR 2,164/m³
- RO-1487 — MAT-GETTI-CRUSHED-40-63 — NPR 2,107/m³
- RO-1488 — MAT-GETTI-CRUSHED-63-80 — NPR 2,107/m³

All are LOC-0002, effective 2026-07-14, SRC-0005, transport included = Yes.

## Post-state
- cr02.sources: 1
- cr02.materials: 10
- cr02.rate_observations: 9
- cr02.rate_analysis: 2
- cr02.rate_analysis_components: 5

## MAT-GETTI-10-16 source correction
No exact canonical `RO-*` exists for `MAT-GETTI-10-16`.

`RO-1486` belongs to `MAT-GETTI-CRUSHED-4.75-25`, which is a broader size range than 10–16 mm. It must not be silently substituted.

Bound rate links for `MAT-GETTI-10-16`: **0**.

## Remaining SRC-0005 mirror population
973 canonical observations total − 9 mirrored observations = **964 remaining**.

## API
No code change was needed. The deployed read-only API queries the live `cr02.rate_observations` table dynamically. The database reader remains write-denied.
