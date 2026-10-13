# M03 · Approved rate-library and contractor views (v0.5.16)

User-approved website milestone, frozen at commit `84f7595adaa5c187b88b75ac186576624212c8f4` from `website/rate-labels-enumeration-20261013`.

- Personal rate library: four columns with S.N. numbering, including inline Mechanical/Electrical/Plumbing views; numbering continues across pagination.
- Contractor index: 158 source-specific work-item/variant readings with short editorial labels, search and page/unit filters.
- Item details retain full descriptions, Norms No., Specification Clause No., units, rates, source-page previews and actual PDF links.
- Contractor table wrapping prevents descriptions overlapping unit/rate columns.
- Earlier evidence explorer retains all 9,574 numeric candidates and 234 page transcripts.
- Frozen M02 raw extraction and full contractor reading projection remain unchanged; rates and other departments were preserved.

## Evidence and interpretation

The evidence page is the earlier machine-extracted numeric-cell/transcript presentation, preserved separately from the readable item index. It is not the original PDF itself, and its numeric candidates include values whose roles may be coefficients, quantities, serial numbers or prices. The item index is a derived summary-row assembly; its short labels are another keyed editorial overlay.

Full semantic source verification remains pending; four item rates remain unresolved. This prerelease freezes the approved website experience, not an approved engineering rate master.

## Version anchors

- Annotated tag: `v0.5.16`
- Frozen product commit: `84f7595adaa5c187b88b75ac186576624212c8f4`
- Approved iteration branch: `website/rate-labels-enumeration-20261013`
- Previous contractor iteration: `80863e5c8c2e4f161187abac5ea74bb6df6fd2d3`
- Frozen raw baseline M02: `80a3650e8de3be1488b742f79246620543d2cffc`

The tag must never be moved. Future edits should create a new iteration branch and a subsequent version, retaining this milestone for rollback.

## Completed checks

Estimation CI `38336448230`, research-preview validation `38336448304` and deployment `38336477275` succeeded. Published changed assets were read back and matched the authored files.

Source archives are available automatically through this release. The attached JSON manifest records the frozen commit, scope and evidence runs.
