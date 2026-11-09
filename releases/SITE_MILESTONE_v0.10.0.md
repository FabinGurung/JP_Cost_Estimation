# A9 JP Cost Estimation — v0.10.0

**9 November 2026 · Source-governed prerelease · Cost Estimation repository only**

## What changed
- **Human-readable original working spreadsheets:** renamed exactly the same five original native Google Sheets and their Drive folder. All permanent IDs, worksheet tab keys, formulas, data, permissions and version histories remain as before. The website source catalogue now displays their human titles and explains what to fill in each.
- **Clear ownership separation:** Rate references, project measurements/BOQ/AOC and actual Finance stay in Cost Estimation. The public Finance selector no longer offers individual worker/attendance/capture workbooks as payment registers. Labour, worker Money & Goods and field capture remain with their existing original custodians and are linked to Field and Desk resources; maps and Slack/Discord-derived daily progress remain with the Communication/Progress workstream. **Neither other repository was modified.**
- **Slim N/W/E/S website:** preserved 71 registered routes and four-direction navigation. The current branded layout and its historical cost/finance calculations remain working.
- **Browser-quality evidence:** automated **27 of 27** real Chromium page/viewport checks passed against the source, and **27 of 27** passed against the actual published site (9 routes × desktop 1440, mobile 390 and tablet 820). Screenshots and machine-readable report are attached to GitHub Actions for 30 days; these are emulated viewports, not physical-device manual tests.
- **Daily LIVE source publication:** `main` now owns the daily **06:32 Nepal time** workflow dispatch to the single research-branch Pages publisher (which already owns WIF authentication, source validation, JSON staging and Pages publishing). Initial push-triggered dispatch and the actual target Pages build passed. No PAT, password, new Sheets database or duplicate Pages publisher was created.
- **Release governance:** this tag freezes the audited tested source commit `478a00fb513ebf29a02cd0687673db15d6e4161a`. Changes to the release records and workflows made after this source commit are versioned but do not alter that frozen source revision.

## Verified evidence
| Gate | Result | GitHub Actions |
| --- | --- | --- |
| Estimation CI, all 71 routes | Passed | https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/42607859733 |
| Source-branch Pages deployment | Succeeded | https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/42607859713 |
| Source-rendered Chromium browser QA | 27/27 passed | https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/42607859756 |
| Daily Pages workflow dispatch (first test) | Succeeded | https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/42607882654 |
| Dispatched LIVE Google Sheets → Pages run | Succeeded | https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/42607894761 |
| Published-site Chromium browser QA | 27/27 passed | https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/42608296229 |

**Actual Pages URL:** https://fabingurung.github.io/JP_Cost_Estimation/  
**Source folder:** https://drive.google.com/drive/folders/1v0yTowZ8mbTtT7euPgrPeEndFKPPH0IU  
**Live-browser screenshots:** https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/42608296229/artifacts/13668124257

## Verified commercial boundary and holds
- Finance source adapter reported **27 vendor groups, 74 payment rows and NPR 268,798** from the separate KKG/Rohini source; that is **not** an Amrit payment total.
- The Amrit project remains at **0 verified measured quantities and 0 approved selected rates**. No certified BOQ, AOC, bills or total are invented.
- `JP_Field_and_Desk_Resource_Library` and `JP_Communication-Command-Centre-and-Resource-Hub` are **handover targets only**; this release does not change them.
- First **actual time-triggered** future cron refresh has not yet occurred; only the identical path-filtered initial dispatch has passed. Physical-device/manual visual QA beyond nine routes remains a separately distinguishable check.

## How to resume
1. Open the five **original** working Google Sheets (the permanent IDs did not change) and enter verified project evidence in the appropriate workbook.
2. For Amrit, write approved drawing-revision quantities to `01_MEASUREMENTS` and approved matched unit rates to `02_RATE_SELECTIONS`, keeping verification statuses and source links.
3. Use the shared Cost Estimation Pages/Actions; source-admission logic refuses to manufacture QTO/BOQ/AOC/paid amounts without evidence.
4. Read `docs/REPOSITORY_BOUNDARIES_AND_SHEET_FILLING.md` for exact record rules and cross-repository ownership.

Previous prerelease `v0.9.0` and all old Git history remain available.
