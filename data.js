// JP Cost & Rate Intelligence v0.5.0-alpha — no project quantities, BOQ calculations, or demo unit prices.
window.JP_RATE_INTELLIGENCE_DATA = Object.freeze({
  version: "v0.5.0-alpha",
  scope: ["RATE_LIBRARY", "RATE_ANALYSIS"],
  currency: "NPR",
  canonical_authority: "AEC_Cost_Rate_Master_v1.0",
  canonical_sheet_url: "https://docs.google.com/spreadsheets/d/1yJX1Dep0_2ZDvRftu3u-Bb6ZbDqtQWKDChQQlYCWYXY/edit",
  cad_boundary: {
    quantity_owner: "CAD repository",
    expected_key: "FID",
    import_state: "NOT_CONNECTED",
    boq_state: "BLANK_TEMPLATE_ONLY",
    contract: "docs/SCOPE_CAD_FID_HANDOFF_v0.5.0.md"
  },
  sources: [
    {id:"SRC-OCE-001", name:"OpenConstructionERP", role:"Open construction cost-workflow design reference; licence review required",url:"https://github.com/datadrivenconstruction/OpenConstructionERP",status:"ARCHITECTURE REFERENCE — NOT INCORPORATED"},
    {id:"SRC-IFC5D-001", name:"IfcOpenShell / IFC5D", role:"Future CAD-side IFC model and quantity interoperability, not a rate-calculation dependency",url:"https://github.com/IfcOpenShell/IfcOpenShell",status:"CAD INTEGRATION DEFERRED"},
    {id:"SRC-QTO-001", name:"aec-platform/qto",role:"Future CAD-side takeoff methodology; this repository does not perform QTO",url:"https://github.com/aec-platform/qto",status:"CAD INTEGRATION DEFERRED"},
    {id:"SRC-DUDBC-001",name:"Nepal DUDBC building works norms",role:"Potential verified resource coefficients and rate-analysis rules",url:"https://dudbc.gov.np/pages/building-rate/",status:"STRUCTURED INGESTION PENDING"},
    {id:"SRC-0005",name:"Kaski District Rate",role:"Dated government resource-price observations; bounded subset in CR-02",url:"https://dcckaski.gov.np/detail/53",status:"PARTIAL CANONICAL INGESTION"},
    {id:"SRC-CR02-MASTER",name:"AEC Cost/Rate Master",role:"Canonical cross-company rate intelligence and original source references",url:"https://docs.google.com/spreadsheets/d/1yJX1Dep0_2ZDvRftu3u-Bb6ZbDqtQWKDChQQlYCWYXY/edit",status:"CANONICAL OPERATIONAL AUTHORITY"}
  ]
});