# Rate Library v0.5.6 · measured price visibility & unit parity

Release date: 2026-10-10. Published site: `rate-library.html`; sibling pages `rate-specifications.html` and `rate-comparison.html`.

## User-facing changes
- The three-column Rate Library is preserved; the rate number is left-aligned in a low-contrast, readable number label instead of being pushed to the outer right edge.
- Source search normalizes punctuation and whitespace and also compares compacted terms; e.g. `cut piece`, `cut-piece`, `cutpiece` all match the original `STONE CLADDING/ CUTPIECE STONE`. No original descriptions are edited.
- SI (default) and Imperial controls translate displayed rate denominators on the rate table, complete work specification and source comparison. A saved browser preference is optional; no canonical source changes.
- Conversion formulas use exact factors: 1 ft = 0.3048 m, 1 ft² = 0.09290304 m², 1 ft³ = 0.028316846592 m³, 1 lb = 0.45359237 kg. Therefore NPR/ft² = (NPR/m²) × 0.09290304; NPR/ft³ = (NPR/m³) × 0.028316846592; NPR/ft or r.ft. = (NPR/m) × 0.3048; NPR/lb = (NPR/kg) × 0.45359237. No currency conversion.
- Piece, Set, No., Point and Job based rates remain identical across the two display systems.
- Display rounds to a maximum of two decimal places; comparisons compute from original numeric rates and only then round for display.
- Source year/location/approval remain unresolved. Historical workbook rates should **not** be used as current approved construction prices.

## Governance / preservation
Original source XLSX in Google Drive, 204 versioned extracted prices in `data/historical-work-rates-v0.5.3.json`, short-title map, editorial taxonomy, 102 matched visible/hidden pairs, finance ledger and blank BOQ unchanged. Site browser CSS and JS only.

## QA
204 extracted records, 7 search normalization aliases, conversion checks including 2500 NPR/m² → 232.26 NPR/ft² and 16000 NPR/m³ → 453.07 NPR/ft³, zero source mutations, syntax checks locally. Headless Chromium access blocked by container administrator, so final public visual QA remains recommended.
