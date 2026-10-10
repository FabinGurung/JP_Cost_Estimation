# Rate Library v0.5.7 — Construction journey and work-specification quality guide

Date: 2026-10-10. UI presentation/editorial enhancement only; no rate validation or approval attempt.

## What changed
- The existing **three-column** /rate-library.html still displays simple work title, unit and historical NPR rate. Every title now has a relevant, non-verbal decorative emoji; title remains accessible and links to /rate-specifications.html?id=<stable-source-id>.
- A small horizontal, mobile-scrollable **Construction journey** helps readers browse from excavation and foundation works through RCC, masonry, openings, rough-in, finishes, fixtures and external works. Clicking a stage filters the existing list. The original workbook order remains available via Sort.
- By default work items appear in an **indicative physical construction sequence**: excavation/site preparation → boulder soling → PCC → steel reinforcement/formwork → structural RCC → masonry → backfill → joinery → MEP rough-in → plaster/screed/waterproofing → tiles/cladding → final surface finishes → fixtures → boundaries. This **is not** a detailed construction schedule or a mandatory site workflow. Construction repeats floor-by-floor and activities overlap; no project-specific sequence or engineering instructions are inferred.
- /rate-specifications.html is retained as the dedicated full-detail subpage. It still displays the exact preserved original source description, unit rate, source-sheet/cell provenance and SI/Imperial conversions. Below, a new distinctly labelled **educational, editorial quality-review checklist** offers typical work-type checks. No user file, statutory code or project-approved requirement is represented as supporting these additional prompts.
- Every stage and emoji derives deterministically from the existing *editorial* family/work-type taxonomy; original descriptions, material specifications and monetary values are not modified.

## Ownership and data boundaries
Source: 204 historical unverified Excel work-rate entries, each with existing PK and 102 visible vs 102 hidden alternatives, from the Google Drive project workbook. Original client/workbook names not projected. The existing JSON rates, curated titles, taxonomy, finance/payment records, blank BOQ and separate CAD/FID quantity-takeoff ownership are unchanged. Both historical workbook versions remain selectable and separate.

## Privacy and safety
No claim of approved workmanship, code compliance, on-site inspection, contractor quality assurance or accepted tolerances. Editorial prompts explicitly defer acceptance criteria to drawings, source specification, applicable regulations and qualified engineers.

## Accessibility / QA
Emoji are decorative with aria-hidden when inside clickable work titles. Stage buttons are real keyboard-operable buttons with aria-pressed states and counted matches. Stage section rows have colspan 3 to preserve the three-column table contract. Construction stage selection, query, division/category/type filter, SI/Imperial toggle, price sorts, pagination and original-workbook-order fallback are preserved. Prefer reduced motion respected by existing stylesheet.

Rollback: PRE = snapshot/pre-construction-flow-emoji-specs-v0.5.7-20261010, POST = snapshot/post-construction-flow-emoji-specs-v0.5.7-20261010. Published source = research/open-estimation-engine-v0.1, with GitHub Pages triggered from main documentation-only commit.
