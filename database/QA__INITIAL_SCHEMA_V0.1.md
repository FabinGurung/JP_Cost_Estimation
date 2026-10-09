# Neon schema QA — v0.1

Project: `square-bar-32494210`  
Database: `jp_estimation`  
Temporary migration branch: `br-hidden-tooth-b39d1dvz`

## Migration state
Production schema is now APPLIED and provider-read back successfully.

The user applied the canonical SQL manually in Neon SQL Editor after explicit approval because the connected production-write path was safety-blocked.

## Production readback
Verified objects on `production` / `jp_estimation`:

Base tables:
- projects
- source_documents
- estimate_versions
- work_items
- quantity_sources
- boq_items
- quantity_records
- resources
- rate_books
- rate_items
- rate_analysis_recipes
- rate_analysis_components
- vendor_quotes
- provenance_edges
- integration_links

Views:
- v_boq_totals
- v_quantity_summary
- v_rate_analysis_component_totals

Production table counts at readback:
- projects: 0
- estimate_versions: 0
- work_items: 0
- boq_items: 0
- quantity_records: 0
- resources: 0
- rate_books: 0
- rate_items: 0

This confirms the schema exists and production is still clean/unseeded.

## Temporary-branch functional test
Before production application, a disposable five-item test estimate was inserted on the temporary migration branch:

1. Foundation excavation
2. PCC below foundations
3. RCC concrete
4. Reinforcement steel
5. Brick/block masonry

Generated BOQ direct total:
`NPR 1,570,809.30`

The generated `amount = quantity * unit_rate` column and quantity-to-BOQ linkage were read back successfully.

## UI note
A later Neon SQL Editor error saying:
`ERROR: syntax error at or near "text"`
was caused by clicking **Analyze**, which wrapped a `CREATE TABLE` statement in `EXPLAIN (ANALYZE...)`. It was not a schema migration failure.

## Guardrail
The test quantities/rates are legacy research seed values only. They are not DUDBC/Kaski official values and will not be presented as such.

## Next gate
Structured source/rate ingestion and production seed data must be added only with provenance and source-status controls.
