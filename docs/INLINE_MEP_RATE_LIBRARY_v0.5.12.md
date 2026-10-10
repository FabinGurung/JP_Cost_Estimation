# v0.5.12 — MEP trade tabs inside the existing Rate Library

Release date: 2026-10-11. Scope: website navigation and interaction; no new project-rate verification.

## Fixed user journey
Rate Library → Construction journey → 🏢 MEP → ⚙️ Mechanical / ⚡ Electrical / 🚰 Plumbing.

Previously each of the three child links opened a separate full-page MEP website section with its own hero, controls and table. That design was confusing and contradicted the intended Rate Library hierarchy. Now each is a native, keyboard-operable **button** within the existing `rate-library.html` page. Clicking a trade reuses the **same three-column table** immediately below the stage ribbon. No page navigation or full-screen replacement occurs. The selected button is visibly active and carries `aria-pressed`; matching result totals are displayed.

Per visible or hidden worksheet set, the stable source categorization yields Mechanical 3 items, Electrical 37, Plumbing/Sanitary 22, or All MEP 62. The same MEP map formerly used by separate pages is reused to classify every source work item. Existing source terms, provenance and unit prices remain unchanged.

The journey's MEP stage remains at the same place among the other work stages. The site's construction-order display sorts MEP items under Mechanical → Electrical → Plumbing and then in each trade's illustrative work type sequence; this is only a browsing order, not a project-specific construction schedule. Switching trades resets other work-division/type filters and the text search to avoid stale empty results; it **preserves the visible/hidden worksheet set and the SI/Imperial measurement system**. The "Show all MEP work items" control resets only the inline trade selection and other trade-specific search conditions. All other construction stage chips, full-source search, pagination and unit conversion remain intact.

## Deep links and old URL compatibility
Direct links `rate-library.html?stage=mep&trade=mechanical`, `...&trade=electrical`, `...&trade=plumbing` and `...&stage=mep` open the matching inline table. Clicking trades changes the browser URL using `history.replaceState`, without loading a new page.

Legacy URLs `mep.html`, `mep-mechanical.html`, `mep-electrical.html`, `mep-plumbing.html` are **not deleted**. They now redirect to corresponding in-page views, preserving supported worksheet, measurement, search and sort URL parameters. Old landing layouts exist in previous Git snapshots for rollback; existing links remain resolvable.

Clicking a **work-item title** still opens its detailed original-Excel-description and general-quality-guidance page. Its Back, breadcrumbs and previous/next controls now return to / work within the same MEP selection on the Rate Library.

## Data and system protections
The 204 source-rate records (102 per Excel worksheet set), 204 short titles, taxonomy, original Google Drive workbook, approved AEC Rate Master, Rohini Finance, Rate Analysis, CAD/FID/QTO ownership, blocked BOQ and currency/unit factors are unchanged. The ventilation fan remains in the Mechanical **user-facing category** while retaining Electrical source provenance. No client/project identifiers or source quantities are exposed.

## QA and recoverability
The MEP regression guard now asserts the in-page trade filters, category totals, absence of standalone links in the Rate Library, old-URL redirect behavior, and drill-down source linkage. Node/JS syntax, CI and Pages deployment must pass. PRE and POST branches protect rollback. A direct phone/tablet visual check remains separate from source-level tests if a browser is unavailable.
