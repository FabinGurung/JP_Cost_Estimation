# Neon schema QA — v0.1

Project: `square-bar-32494210`  
Database: `jp_estimation`  
Temporary migration branch: `br-hidden-tooth-b39d1dvz`

## Migration state
Prepared only. Production has NOT been mutated.

## Tables created on temporary branch
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

## Functional test
A disposable test estimate with five seeded work items was inserted on the temporary branch:

1. Foundation excavation
2. PCC below foundations
3. RCC concrete
4. Reinforcement steel
5. Brick/block masonry

Generated BOQ direct total from database:
`NPR 1,570,809.30`

The generated `amount = quantity * unit_rate` column and quantity-to-BOQ linkage were read back successfully.

## Guardrail
These test quantities/rates are legacy research seed values only. They are not DUDBC/Kaski official values and will not be presented as such.

## Production gate
Apply the migration to production only after explicit approval.
