# A9 CR-02 ↔ Neon Reconciliation — Temporary Branch QA

Status: **TEMPORARY-BRANCH CLOSED PASS / PRODUCTION NOT PROMOTED**

Canonical Drive authority:
- Cost/Rate Control Tower: `1lRLUTHaPpD-Ki7yeEsr1RKt-5MXnj_4TM2VbVnp14eI`
- AEC Cost Rate Master: `1yJX1Dep0_2ZDvRftu3u-Bb6ZbDqtQWKDChQQlYCWYXY`
- Canonical Kaski source: `SRC-0005`, Drive ID `1RDinUWvdJXICsGUP8CDVDausf-jk_97X`

Temporary Neon test:
- project: `square-bar-32494210`
- database: `jp_estimation`
- branch: `a9-cr02-schema-reconcile-v2-20261002`
- branch ID: `br-silent-dust-b3l6w426`

## Reconciliation rule
The Drive Cost/Rate warehouse remains content authority. Neon is a normalized query mirror and must preserve canonical `SRC-*`, `WRK-*`, `MAT-*`, `RO-*`, `RA-*`, and `RAC-*` identities.

The earlier research ID `SRC-KASKI-2083-84` is retained only as a superseded alias of canonical `SRC-0005`.

## Bounded verified mirror
Exact canonical rows mirrored for QA:
- `RO-1468` → `MAT-CEMENT-OPC` → NPR 708/bag → `LOC-0003`
- `RO-1482` → `MAT-CRUSHER-SAND` → NPR 2,877/m³ → `LOC-0002`
- `RO-1508` → `MAT-RMC-M20` → NPR 12,500/m³ → `LOC-0002`
- `RO-1514` → `MAT-REBAR-FE500-TORSTEEL-10-20MM` → NPR 91/kg → `LOC-0003`

## Rate-analysis QA
`RA-0001` / 1:4 screed:
- RAC-0001 cement = 7.6657 × 708 = NPR 5,427.3156
- RAC-0002 crusher sand = 1.064 × 2,877 = NPR 3,061.1280
- known material-component total = **NPR 8,488.4436**
- 2/2 mirrored components rate-resolved

`RA-0002` / 1:3:3 PCC:
- RAC-0003 cement = 6.3401 × 708 = NPR 4,488.7908
- RAC-0004 crusher sand = 0.66 × 2,877 = NPR 1,898.8200
- RAC-0005 canonical material = `MAT-GETTI-10-16`, quantity 0.66 m³/m³ output
- no exact canonical `RO-*` rate observation was resolved for `MAT-GETTI-10-16`
- known-component subtotal = **NPR 6,387.6108**
- 2/3 components rate-resolved

No alternate aggregate rate was substituted.

## Production gate
No `cr02` schema or canonical rate mirror has been promoted to production Neon. A separate A9 production promotion gate is required after this temporary-branch QA.

## Known unresolved items
- exact current rate observation for `MAT-GETTI-10-16`
- canonical Work_Item_ID for generic excavation, RCC structural concrete, reinforcement installation, and brick masonry if/when those work types are needed
- full 973-row SRC-0005 mirror has not been attempted
- frontend still uses research/demo calculation values and is not yet reading this temporary `cr02` schema
