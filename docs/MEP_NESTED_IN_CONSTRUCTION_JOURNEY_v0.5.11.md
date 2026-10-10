# v0.5.11 — MEP nested inside the Rate Library construction journey

Release date: 2026-10-10. UI/information-architecture correction at the user's request.

## Correct navigation ownership
The Rate Library is the parent. MEP is **one of the Rate Library's construction stages**, alongside excavation, soling, PCC, RCC and masonry, rather than a sister-level website area. When MEP is selected from the horizontal journey, the page expands to show three child branches: Mechanical, Electrical and Plumbing. The separate existing `mep.html` overview and three trade detail URLs continue working so shared bookmarks do not break.

Parent/child pathway: Home → Rate Library → Construction journey → 🏢 MEP → ⚙️ Mechanical / ⚡ Electrical / 🚰 Plumbing → Work Specifications.

MEP is no longer a peer in the homepage or Rate Library sidebar. On each MEP page, the sidebar uses an indented MEP subtree under Rate Library, and breadcrumbs link back to the MEP construction stage. There is no separate MEP marketing workspace block beneath the journey.

## Stage consolidation and record traceability
The editorial construction stages formerly split MEP among “Electrical & plumbing rough-in” and “Services, fixtures & commissioning”. These have been replaced by one MEP stage at order 90, after openings and before plaster/finishes (indicative learning order only). All 62 MEP rate records in each worksheet set (3 Mechanical / 37 Electrical / 22 Plumbing) map to the MEP stage; 40 other source work items per set remain in their distinct non-MEP stages. The table still displays its same three columns and all the original 102 rate rows per worksheet set. When the MEP stage is selected, its child links are shown **inside** that stage and the catalog can still be searched/filtered. Other stage chips retain their existing behavior.

This stage grouping is an illustrative learning/navigation order, not a claim that MEP physically occurs all at once or before all finishes. Actual rough-in, second-fix and commissioning overlap with other trades and follow approved project design.

## Governance
No changes to original Drive workbook, 204 source observations, existing curated work titles, published taxonomy, rates, SI/Imperial conversion, finance and payments, BOQ controls, engineering CAD/FID takeoff or existing rate-analysis logic. Source worksheet identity remains intact and ventilation fan remains editorially in Mechanical with original Electrical provenance. Deep links /mep.html, /mep-mechanical.html, /mep-electrical.html, /mep-plumbing.html and work-specification IDs remain valid.

The existing regression test `scripts/qa_mep_site_v0.5.10.mjs` is extended to assert 62 unique MEP stage items per worksheet set and the absence of top-level MEP peer links. GitHub Actions syntax and regressions plus deployment must pass.
