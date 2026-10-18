# FBL Field Expense Tutorial — release handover v0.1

Task ID: `FBL-FIELD-EXPENSE-ONBOARDING-20261018`.
This work is intentionally limited to a **public-safe how-to website** plus private communication to two individually identified site engineers. It does not migrate financial facts or grant access to another employee's workbook.

## Authority routing
- Public code, tutorial text and release manifest: repository `FabinGurung/JP_Cost_Estimation`, source branch `research/open-estimation-engine-v0.1` and feature branch `feature/fbl-engineer-expense-guide-v0.1-20261018`.
- Pages deploys **source branch** via main branch workflow `.github/workflows/deploy-estimation-product.yml`. Do not modify Pages deployments or GitHub Actions workflows directly.
- Private source: each employee's individually permissioned personal expense Sheet created 18 Oct 2026. **Do not store private file URLs, IDs or email addresses in the public site/repository.**
- Verified per-person access was checked independently prior to outreach; employees do not share each other's private workbooks.
- Personnel attendance and Fishtail shared cement / Daily Progress retain their original Drive authority; Rohini / Krishna Kumar Gupta payment register and PDF rate ingestion remain separate.
- Operational messages and delivery receipts belong in a restricted Drive record; never in public GitHub.

## Website deliverable
`field-expense-guide.html` (mobile-first, zero network calls, no private links or embedded data) explains 8 columns, 6-step entry process, receipt links, FBL project choices, non-expense advances, FAQs, and no deletion of history. `index.html` gains one discoverable navigation entry. All examples are explicitly hypothetical.

## Version-control and no-collision contract
1. Check source and main HEAD before publication. Never force push.
2. Feature change should merge to **research source only**, not directly to main. Main is deployment orchestration.
3. Run existing research CI and preview, verify deployed HTML and navigation at published Pages URL.
4. Only on verified public deployment, send *one individually addressed Gmail* and *one Slack DM* to each engineer; do not post private links into channels.
5. Save Gmail message IDs and Slack permalinks in a restricted Drive control record for dedupe; public repo records no identities.
6. Do not run another send if the same recipient/channel is already marked sent; read back the private receipt log.
7. If deployment cannot be verified, send a private direct-link instruction but call the tutorial unpublished; never invent success or live URLs.

## Excluded work
No modifications to finance-summary.json, finance.js, expenses, source Sheets, field progress, identity registries, PDF rate sources, protected historical snapshots or production Apps Script.
