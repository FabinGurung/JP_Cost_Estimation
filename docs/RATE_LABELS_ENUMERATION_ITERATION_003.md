# Personal enumeration and contractor short labels — iteration 003

The personal rate library now has four columns: S.N., Description of Work, Unit, Rate (NPR). Numbering follows the current filtered/sorted list and continues across pagination; section headings do not consume numbers. All inline Mechanical/Electrical/Plumbing views use the same numbered table. Loading, empty, error and stage-heading rows span four columns. A personal-only stylesheet preserves the other pages' three-column layouts.

All 158 contractor item/variant rows now use editorial short descriptions, each at most 84 characters. Key distinctions include material, grade, dimensions, depth/height, lead, method and formwork inclusion/exclusion. These are browsing labels, with full wording retained in the click-open detail panel. Search matches both shortened labels and full descriptions. Ambiguous OCR qualifiers were read against original scans; labels do not change any rate, unit, norm, clause, raw field or full description.

`data/contractor-short-labels.v0.1.json` is a new keyed overlay anchored by the SHA-256 of the unchanged `contractor-work-items.v0.1.json`. The previous projection, frozen M02 raw baseline, original PDF, page images and 9,574-candidate/234-transcript evidence view are unchanged. The contractor-specific CSS now overrides global nowrap rules and assigns four fixed column widths, preventing description text from overlapping units and prices on desktop or mobile.

Branch: `website/rate-labels-enumeration-20261013`.
Previous iteration: `website/contractor-work-items-20261013`, commit `80863e5c8c2e4f161187abac5ea74bb6df6fd2d3`.

Validation: JS syntax; contractor label/source hash and variant contracts; personal/MEP enumeration and regression; six-source derived data checks; finance regression. Git tree comparison limits changes to these two views and their directly associated assets/tests/documentation. Full semantic source verification remains pending; four source rates remain unresolved. Visual review remains the user's iterative feedback step.
