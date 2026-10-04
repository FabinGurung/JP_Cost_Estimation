# Known Rates secondary sub-page

## Purpose
Provide a fast searchable reference surface for rates the user already knows and supplies manually.

This page is deliberately separate from:
- the canonical AEC Cost/Rate Master;
- official Kaski/DUDBC observations;
- vendor quotations;
- verified project actuals;
- the estimator's demo/benchmark seed rates.

## Stable identifier
Manual reference records use `KR-*`.

They are not `RO-*` observations unless a later governed reconciliation explicitly promotes/supports them with appropriate source evidence.

## Required fields
Each entry should preserve, when supplied:
- work name and searchable aliases;
- category;
- NPR rate and unit;
- rate basis/scope;
- included items;
- excluded items;
- location;
- effective date;
- recorded date;
- source/status;
- notes and unresolved context.

Missing facts stay `null`/unspecified.

## First record
`KR-0001` — Stone cladding — NPR 2,300/m².

Included: labour, materials, equipment.  
Excluded: electricity, water.  
Location: unspecified.  
Effective date: unspecified.  
Source class: `USER_KNOWN_REFERENCE`.

## Search contract
A query for `stone cladding` must resolve `KR-0001`. Search also indexes aliases, category, basis, inclusions, exclusions, unit, location and notes.

## Update workflow
Future user-supplied rates are appended to `known-rates-data.js` with a new stable `KR-*` ID and then deployed to the research preview. Existing rates are not silently overwritten; material changes should preserve change history through Git.
