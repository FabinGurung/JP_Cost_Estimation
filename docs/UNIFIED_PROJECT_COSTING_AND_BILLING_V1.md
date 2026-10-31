# A9 / JP Project Measurements → BOQ → AOC and Commercial Billing

Version: V000001 · 2026-10-31 · Public machine schema; no project-specific source evidence admitted.

## Source anchor and audit

The provided Drive folder contains the immutable **Fishtail Builders / Measurement Of Works** Discord extraction, organized by **work category → project thread → source message / attachment**. A governed fixed anchor exists as a separate source record; the archive reports 38 channels, 52 threads, 1,156 messages, 1,388 vaulted attachment IDs and zero missing attachments at capture closeout. **We inspected the category tree and selected project-thread names for taxonomy only.** These are **not** verified Amrit quantities, signed contract measurements, supplier bills or payment records. Do not ingest them into an unrelated company's project or publish private archive attachments. Work names incorporated here include RCC footings/beams/columns/slabs, brickwork, soling, formwork, BBS, waterproofing, tiling, granite, paint, electrical, uPVC, metal railing, screeding and punning.

Human source entry: original A9 Discord hierarchy in the user's supplied Drive folder. Fixed anchor and immutable source evidence remain in Drive. The public site exposes a generic work catalog but not raw messages/attachments.

## Single master contract

`templates/project-costing/v1/master-template.json` is the ONE reusable layout and input contract, used without copying/modifying its schema per client. `work-catalog.json` is a shared work method taxonomy. A project creates its own **one source-specific** projection (e.g., Amrit `project-costing.json`) referencing template ID/version. Operational source authorities (Google Sheet IDs) are declared only after observed readback; values are null until then. Each project has separate work-detail pages rendered by ONE shared `project-view.mjs`; all pages derive from the same project projection and upstream evidence.

### 1. Detailed Measurement / QTO

Grain: a measured building element, location or site line, with quantity and unit. Required: org/project/work/work-item/measurement IDs, element or grid, method (L×B×H, length, weight/BBS bars, count, etc.), quantity, unit, date/revision, source drawing/file or captured message/attachment ID, verification/approval. Determine and deduct openings, overlaps, laps and variations according to contract. Both geometry and measurement evidence are upstream; no guessed quantities. Distinguish contract-billable quantity from geometric takeoff when contract methods differ.

### 2. BOQ (Bill of Quantities)

One compact line for a compatible work-item + unit + version-approved rate choice. `SUM(verified component measurements) × selected source-linked rate` yields a DRAFT extension. The BOQ includes measurement IDs and drawing revision lineage, chosen rate source/version and scope. Approval is independent. Turnkey/grey package, labour-inclusive and individual trade alternatives must never double count. The existing historical `boq-template.json` remains blocked until CAD/FID proof exists.

### 3. AOC (Abstract of Cost)

Group **approved** BOQ lines into structural, architectural, MEP, finishing, external or other configured groups. Report each approved BOQ subtotal, then separately approved allowances, taxes, contingencies, exclusions and final project cost. Non-approved BOQ lines or unselected scope alternatives do not form project totals. AOC is summary of estimate, never a payment receipt.

## Running account bills and vendor commercial documents

**Contractor RA Bill:** has project + contractor + contract ID, period/cutoff, current cumulative measured/certified quantities per work item, previous certified cumulative quantity, *this period* quantity (delta) and contracted rate. Quantities may not regress or exceed approved contract/BOQ allowance without authorized variation. Gross value is distinct from deductions: retention, advance recovery, tax withholding, adjustments, prior payments and net payable are separate approved lines. Each certified RA bill needs certificate/evidence and contract revision. A final bill includes prior-bill settlement and completion verification; it cannot simply duplicate a running bill.

**Vendor invoice:** one vendor, PO, delivery/GRN, invoice no/date/source document, material/product spec, quantity, unit and agreed price. Items are matched against approved PO and verified deliveries; tax/discount/transport/returns remain distinct. Neither a quotation nor invoice is itself an actual payment.

**Actual payment:** admitted ONLY from verified original Finance Sheet transactions with unique transaction IDs, company/project ownership, paid date/mode and allocated bill/invoice evidence. One source transaction must not be double counted. Contractor billing and supplier procurement stay distinct from approved BOQ and AOC.

**Source admission update after native creation (2026-10-31):** a single distinct nine-tab LIVE Google Sheet for Amrit measurement/BOQ/AOC/contractor and vendor bills now exists: https://docs.google.com/spreadsheets/d/1QfVM08Zvd_mv7EXcTxT9WMYPHzTAUHOTmL10ULo4oIA/edit . The reusable MASTER TEMPLATE is https://docs.google.com/spreadsheets/d/1TSBHMSjOGuWcVkEnKsjFHpEYi191RMwdp5bfCqBkzCY/edit . Amrit's LIVE Sheet is blank of actual quantities and bills, independently of the historical 32-rate Sheet. V000001 POST copy is in `90_VERSION_HISTORY__AMRIT_RAWAT_COSTING`. No new native Sheet refresh by GitHub Actions has yet run. Actual payment authority remains the pre-existing Finance Sheet (not the allocation tab). Public pages remain safely empty. Github Actions validates public projections and publishes static read-only views. Future source connectors must use keyless WIF or an explicit authorized read-only source; release logs must distinguish authenticated refresh from historical snapshots.

## Restoration

PRE branch `snapshot/pre-unified-measurement-boq-aoc-billing-20261031`; existing Git history preserved. Existing Amrit LIVE rate Sheet remains untouched and its 32 indicative entries unchanged. No previous public routes deleted; all new work pages are additive.
