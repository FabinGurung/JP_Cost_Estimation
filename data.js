window.JP_ESTIMATION_DATA = {
  version: "research-v0.1",
  baselineCommit: "98b09c4d035bdde2964c356a4326c3a33fd529ee",
  currency: "NPR",
  project: {
    project_id: "PRJ-DEMO-KUMARI",
    name: "Kumari Gurung Residence",
    location: "Pokhara",
    built_sqft: 1295.21,
    floors: 2,
    estimate_version_id: "EST-RESEARCH-0001"
  },
  assumptions: {
    SQFT_TO_M2: 0.09290304,
    EXCAVATION_M3_PER_M2: 0.22,
    PCC_M3_PER_M2: 0.035,
    RCC_M3_PER_M2: 0.27,
    REBAR_KG_PER_M2_2F: 39,
    MASONRY_M3_PER_M2: 0.18,
    OVERHEAD_PCT: 10,
    CONTINGENCY_PCT: 5
  },
  workItems: [
    {work_id:"WRK-EST-001",code:"EW-EXC",name:"Foundation excavation",unit:"m³",factor_key:"EXCAVATION_M3_PER_M2",rate:800,rate_code:"EXCAVATION_M3"},
    {work_id:"WRK-EST-002",code:"FND-PCC",name:"PCC below foundations",unit:"m³",factor_key:"PCC_M3_PER_M2",rate:13000,rate_code:"PCC_M3"},
    {work_id:"WRK-EST-003",code:"STR-RCC",name:"RCC concrete",unit:"m³",factor_key:"RCC_M3_PER_M2",rate:19000,rate_code:"RCC_M3"},
    {work_id:"WRK-EST-004",code:"STR-RBAR",name:"Reinforcement steel",unit:"kg",factor_key:"REBAR_KG_PER_M2_2F",rate:120,rate_code:"REBAR_KG"},
    {work_id:"WRK-EST-005",code:"WALL-MAS",name:"Brick/block masonry",unit:"m³",factor_key:"MASONRY_M3_PER_M2",rate:14500,rate_code:"MASONRY_M3"}
  ],
  sourceRegistry: [
    {
      source_id:"SRC-OCE",
      name:"OpenConstructionERP",
      role:"Workflow / BOQ / cost-control architecture",
      url:"https://github.com/datadrivenconstruction/OpenConstructionERP",
      license:"AGPL-3.0",
      status:"STUDY / ADAPT WITH LICENSE REVIEW"
    },
    {
      source_id:"SRC-IFC5D",
      name:"IfcOpenShell / IFC5D",
      role:"IFC quantity and cost interoperability",
      url:"https://github.com/IfcOpenShell/IfcOpenShell",
      license:"LGPL ecosystem",
      status:"ADOPT AS INTEROPERABILITY LAYER"
    },
    {
      source_id:"SRC-QTO",
      name:"aec-platform/qto",
      role:"Transparent IFC quantity takeoff and national mapping pattern",
      url:"https://github.com/aec-platform/qto",
      license:"MIT",
      status:"ADAPT"
    },
    {
      source_id:"SRC-DUDBC",
      name:"Nepal DUDBC building works norms",
      role:"Nepal technical / rate-analysis authority",
      url:"https://dudbc.gov.np/content/2365/2365-bhawan-nirmancivilkaryaharu/",
      license:"Official publication; reuse terms to be verified",
      status:"PENDING STRUCTURED INGESTION"
    },
    {
      source_id:"SRC-KASKI",
      name:"Kaski District Rate",
      role:"Dated local labour / material / equipment rates",
      url:"https://dcckaski.gov.np/detail/53",
      license:"Official publication; reuse terms to be verified",
      status:"PENDING STRUCTURED INGESTION"
    }
  ],
  provenance: {
    quantity_source_id: "LEGACY-BENCHMARK-V0.1",
    rate_source_id: "LEGACY-DEMO-RATE-V0.1",
    norm_source_id: null,
    quantity_status: "DEMO / BENCHMARK",
    rate_status: "DEMO / NOT OFFICIAL",
    norm_status: "PENDING DUDBC INGESTION"
  }
};