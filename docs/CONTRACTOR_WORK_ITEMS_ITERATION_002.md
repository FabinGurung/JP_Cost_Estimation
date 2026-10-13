# Contractor work-item view — iteration 002

The contractor route now presents 158 road-work summary item/variant readings in four columns: S.N., Description, Unit, Rate (NRs.). Description buttons open all six source fields, a scan preview, the actual PDF excerpt and a link to the complete original PDF. Search covers descriptions, source serial labels, norms, specification clauses, units and rates; filters support PDF page and unit. Existing `?view=candidates` links now open the item list. All 9,574 numeric candidates and 234 transcripts remain accessible through `contractor-extracted-evidence.html`.

This is a new, provisional derived projection from summary pages 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25 and 27. It does not claim that the entire book has been semantically verified. Four rates remain null/unresolved. Blank source serials 52 and 130 are not priced entries. Parent headings are joined to their variants; browsing suffixes are distinguished from printed serial fields in the retained raw data. Cross-page parent evidence is shown separately, including item 131's wording on page 25 and continuation on page 27. Norm, unit and clause readings may still contain OCR errors.

## Storage and evidence

- Frozen raw baseline: `M02 / m02-raw-v1`, commit `80a3650e8de3be1488b742f79246620543d2cffc`; unchanged.
- Original source SHA-256: `c2c5123768311631ec0d7aa00d77697fca63b8d983d9927071b6a26610a3cd3c`.
- New projection: `data/contractor-work-items.v0.1.json` (~170 KB), with raw fields, stable IDs, frozen page record IDs, parent anchors, deskewed-render row locations, transcription overlay field names and review status.
- Source-page excerpt: `data/contractor-summary-v0.1/summary-source-pages.pdf`, copied from the original PDF, with 12 pages in source order. Viewer page 1 corresponds to original PDF page 5. All links distinguish viewer indices from original page numbers.
- Page images: JPEG renderings at 144 dpi, loaded only when item details are opened. The PDF panel loads only when expanded.
- Contractor-specific HTML/JS/CSS isolate the new item experience. The shared source loader, personal library, finance, other source views and their data are unchanged.

## Versioning

Iteration branch: `website/contractor-work-items-20261013`. Previous contractor view is recoverable at commit `545cc15809496742d6812541f1bd819c169ceae8` and branch `website/contractor-source-link-20261013`. Future source corrections should create a new projection revision and iteration branch instead of overwriting M02.

## Validation boundary

Contractor contract checks cover four columns, six-field details, known page-5/page-27 rate mappings, variant/parent links, unresolved values, scan assets, PDF signature and retention of the old evidence explorer. Existing source, personal/MEP and finance regressions pass. Browser visual QA and full semantic source verification remain for the user's iterative review.
