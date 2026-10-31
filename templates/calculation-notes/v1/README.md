# JP Calculation Notes · V000001

These are **public reusable templates only**, not the authority for any client's private observations.

## Authoring choice

- Use `field-calculation.qmd` for simple/complex notes in one human-readable document: text, formulas, assumptions, methods, evidence and optional code.
- Use `.ipynb` for interactive or exploratory code and charts where needed.
- Keep originals (PDF, scan, photo, CAD, message archive) in the owning project's restricted Drive folder.
- Keep project working notebook in controlled private storage; **never commit its contents, screenshots, source links with sensitive information or executed outputs to this public GitHub repo**.
- Keep one stable document ID for the subject. Preserve numbered PRE/POST copies and append-only revision metadata before admitting changing measurements.
- Source-ledger data, accepted BOQ and paid records may still use the existing LIVE Sheets, CAD model or an access-controlled database depending on subject.

## Required QA

1. Original evidence exists and matches declared organization/project, location and revision.
2. Mathematical dimensions have documented units and deduction rules; do not mix m, m², m³, kg or sq.ft.
3. Output must have measurement ID, source document, source revision, verifier and method.
4. Draft calculations are not BOQ quantities. The reviewer explicitly admits selected records.
5. AOC aggregates only approved BOQ. Contractor RA certificate, vendor invoice and payment refer to different records.
6. Only approved public fields may enter Actions snapshots.

In the `manifest.schema.json` the `quantity` property may be null, not zero, when pending. `status` and `review` are independent: code output alone does not approve a measurement.

Publication references are catalogued under `data/methodology-literature-v1.json`. Original technical standards are linked, not copied.
