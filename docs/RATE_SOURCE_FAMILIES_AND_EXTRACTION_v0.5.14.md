# JP Cost v0.5.14 — Rate Source Family Skeleton and Extraction Handoff

Date: 2026-10-11. Status: **METADATA-INVENTORIED, FULL PDF EXTRACTION PENDING**.

## User-facing information architecture

Four sibling rate libraries, each at equal hierarchy:
- `rate-library.html` — JP / My Personal Working Rates (existing 204 Excel-derived reference rows; unchanged).
- `government-rates.html` — Government District Rates; Kaski FY 2083/84 PDF source skeleton.
- `vendor-price-lists.html` — Vendor Prices & Quotations; pipes price list and an electrical wire quotation skeleton. The wire source states Pending and contains party-specific data, so no prices/details are publicly projected.
- `rate-analysis-references.html` — Contractor Rate Analysis, Users Rate Analysis and DUDBC Rate Analysis PDF. The separate operational `index.html?view=analysis` remains the **calculation tool**; these are evidence books, not a duplicate calculator.

A `rate-sources.html` hub shows four equal cards. Each PDF has an independent subpage with a permanent route, four-column empty preview table and source status. Pages are attractive but deliberately not populated before full extraction. All source preview rows remain unverified/pending, not artificially zero. Six source preview routes:
`kaski-district-rates.html`, `pipes-price-list.html`, `electrical-wire-quotation.html`, `contractor-rate-analysis.html`, `users-rate-analysis.html`, `dudbc-rate-analysis.html`.

The existing government subset shown at the old portal is not silently copied into this Kaski PDF page: source/edition/row linkage to that specific PDF has not been proved.

## Verified inventory
One folder supplied by user: Drive `01_Source_Documents`, with subfolders `01_Government_Rates`, `02_Vendor_Quotes_Price_Lists`, `03_Rate_Analysis_References`. Five distinct PDFs present in these three source subfolders. Sixth DUDBC-titled rate analysis PDF exists under a different Drive parent; preserve its true original location and include via stable reference, **not by relocating or duplicating the binary**.

- GOV: one Kaski District FY 2083/84 PDF.
- Vendor: pipes/fittings 2082.01.03 price list, electrical wire quotation.
- Analysis: Contractor 82–83 and Users 82–83 PDFs.
- External reference: one separate DUDBC-titled rate analysis PDF.
- Simple text fetch yielded some text for Kaski and both vendor files; contractor rate-analysis PDF yielded no text through that pathway. This is **not** a complete parsed corpus and does not establish page coverage, tables or rate observations.

The **private** Drive-normalized folder holds a newly registered machine-readable JSONL-in-Google-Doc inventory of six source IDs/file identities, verified parent folders, file sizes, and status. This private source inventory deliberately is **not** pushed into public GitHub. User-source master identity must later be reconciled with the live AEC Cost Rate Master / 06_Source_Index to avoid collision or duplicate official Source_ID registration. Public GitHub IDs `SRC-GOV-001`, `SRC-VEN-001`, etc. are **projection aliases**, not claims of canonical Source_ID allocation.

## Extraction target — primitive and future-query friendly

The next Work 6.1 run should produce **UTF-8 newline-delimited JSON (JSONL)**, not one giant JSON object or HTML scrape, with the following private source-specific files grouped by original document SHA-256/edition.

- `sources.jsonl`: exact Drive ID, source hash, page count, edition, source family, jurisdiction/validity, run/checkpoint, original filename/parent.
- `pages.jsonl`: (source_id, page_no, page-size, extraction strategy, raw text), optionally a separate compressed text block archive.
- `blocks.jsonl`: fine-grained text/table block, page number, reading order and PDF bounding box coordinates; preserve original Nepali/English Unicode.
- `table_cells.jsonl`: table ID, row/column and cell source span; allow reconstruction of headings/footnotes.
- `observations.jsonl`: **one atomic fact per row** with item/work/resource ID, raw description, raw unit, normalized unit, raw numeric string, parsed value or null, currency, scope, effective year, source page/row, confidence and review status. JSON Schema: `schemas/rate-observation.v0.1.schema.json`.
- `recipes.jsonl`: each rate-analysis coefficient as its own linked resource observation/recipe component (labour, materials, equipment, electricity, water, PPE etc. where genuinely stated by the source).
- `provenance_edges.jsonl`: fact -> exact cell/line/bbox -> page -> source document -> original Drive link/sha256; stable source-first primary/foreign keys.
- `qa.jsonl`: blank/unreadable pages, OCR uncertainties, ambiguous rates/units, conflicts and manual review.
- `manifest.json`: total pages, covered pages, records, hash, extraction tool/version, partial/complete flags, readback evidence.
- Optional **derived** `catalog.sqlite` or DuckDB for indexed queries; JSONL + original PDFs remain authoritative. All duplicates are recorded but not silently collapsed.

Schemas here are public blueprints without private data or source IDs. Do not publish PDF text/rates/party data until source-by-source approval and read-back. Vendor quotations require confidentiality screening.

## Idempotency and QA
Inventory by exact Drive file ID and SHA-256; do not recopy the PDFs. Stable observation ID should be derived from normalized source identity + file hash + page + table + row/anchor + observation type, with an explicit collision log and no loss of source text. If a PDF changes, create an additional source version, not an overwrite. Page completeness check `verified_pages == source_page_count`, table/cell consistency, numeric/unit QA, field provenance and spot-check render of problematic pages. Use native text first; selectively OCR pages that genuinely require it. No hallucinated missing cells.

Never combine Kaski district market/resource benchmarks, quoted pipe/electrical products, Contractor/User rate-analysis work recipes, DUDBC rate analysis or JP personal finished-work rates into one published price list. Matching scopes are **comparison candidates** with their own review approvals, not a source merge.

No company finance, project records, CAD/FID QTO, approved master, existing Rate Analysis formulas or M01/v0.5.12 Git tag changed. v0.5.14 is a skeleton milestone/checkpoint only, not a full extraction closure.
