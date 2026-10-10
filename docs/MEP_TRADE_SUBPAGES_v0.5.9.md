# MEP dedicated subpages v0.5.9

Date 2026-10-10. Website presentation release only; no source-rate verification.

## Navigation
- mep.html: MEP overview and three trade choices.
- mep-mechanical.html: 3 records per worksheet set (2 HVAC units, 1 exhaust fan).
- mep-electrical.html: 37 records per worksheet set.
- mep-plumbing.html: 22 records per worksheet set (11 original Plumbing, 11 original Sanitary).

Each worksheet set has 62 unique MEP items; the two worksheet sets contain 124 MEP records total. Of 204 original rates, 80 are non-MEP in both sets combined, or 40 non-MEP per set.

The exhaust fan is on an original Electrical Works worksheet, but is placed on the Mechanical page for human-friendly navigation. The source division, family, original description, numeric rate and Excel cell provenance remain unchanged. Plumbing combines the source Plumbing and Sanitary families without rewriting their source classification.

## UX and governance
Three dedicated, mobile-friendly MEP trade pages use three-column tables (Description of Work, Unit, Rate in NPR), short names, emojis, live text search over the complete source wording, category filtering, worksheet visibility selection, SI/Imperial calculations, sorting and pagination. Clicking a source item opens the existing Work Specifications/educational workmanship page using its stable ID, with back navigation to the trade page.

All pages are static read-only projections of 204 original unverified estimate observations. Visible and hidden worksheet sets are not dated sequential revisions, approved rate lists, or current market quotes. No source-originals are published. The original Google Drive workbook, source data JSON, short-name map, rate taxonomy, Rohini financial records, Rate Analysis, CAD FID/QTO ownership, and blank BOQ template remain unchanged.

## Controls
Routing uses deterministic source-family assignment. Mechanical = original HVAC + original Electrical Ventilation; Electrical = all remaining Electrical; Plumbing = original Plumbing plus Sanitary. Each source ID appears once per worksheet set across the MEP pages. The release checks 62 unique IDs and category counts 3/37/22 independently in both sets, compiler/syntax and unchanged source blobs. PRE/POST Git branches are retained for rollback. Browser QA is separate from GitHub CI.
