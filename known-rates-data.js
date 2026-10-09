window.JP_KNOWN_RATES_DATA = {
  version: "known-rates-v0.1",
  updated_at: "2026-10-04",
  currency: "NPR",
  authority: {
    class: "USER_KNOWN_REFERENCE",
    canonical_official_rate: false,
    note: "Fast-search reference knowledge supplied manually by the user. This page does not replace the governed AEC Cost/Rate Master, Kaski/DUDBC sources, vendor quotations, or verified project actuals."
  },
  entries: [
    {
      known_rate_id: "KR-0001",
      work_name: "Stone cladding",
      aliases: ["stone wall cladding", "stone veneer", "cladding stone"],
      category: "Finishes / Cladding",
      rate_npr: 2300,
      unit: "m²",
      rate_basis: "All-in whole-work rate",
      included: ["Labour", "Materials", "Equipment"],
      excluded: ["Electricity", "Water"],
      unspecified: ["Location", "Effective date", "Tax", "Transport treatment"],
      location: null,
      effective_date: null,
      recorded_date: "2026-10-04",
      source_type: "USER_KNOWN_REFERENCE",
      source_label: "User-supplied known rate",
      status: "REFERENCE",
      confidence: "USER-KNOWN",
      notes: "Use as a fast reference until project/location/date-specific evidence is supplied."
    }
  ]
};
