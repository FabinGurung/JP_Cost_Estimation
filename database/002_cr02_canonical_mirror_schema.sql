-- A9 CR-02 / Neon compatibility mirror v0.1
-- Purpose: mirror the canonical AEC_Cost_Rate_Master identities into Neon
-- without creating a competing cost/rate authority.
-- Canonical Drive master: 1yJX1Dep0_2ZDvRftu3u-Bb6ZbDqtQWKDChQQlYCWYXY
-- Tested first on temporary Neon branch br-silent-dust-b3l6w426.
-- DO NOT treat this schema as authority over Drive.

CREATE SCHEMA IF NOT EXISTS cr02;

CREATE TABLE cr02.sources (
  source_id text PRIMARY KEY,
  source_type text NOT NULL,
  source_title text NOT NULL,
  issuer_vendor text,
  location_text text,
  source_date_text text,
  valid_from date,
  valid_to date,
  drive_file_id text,
  drive_link text,
  local_original_name text,
  reliability text,
  can_show_client text,
  notes text,
  mirrored_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cr02.work_items (
  work_item_id text PRIMARY KEY,
  category text,
  plain_name text NOT NULL,
  technical_name text,
  default_unit text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  notes text,
  mirrored_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cr02.materials (
  material_id text PRIMARY KEY,
  category text,
  generic_name text NOT NULL,
  specification text,
  default_unit text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  notes text,
  mirrored_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cr02.vendors (
  vendor_id text PRIMARY KEY,
  vendor_name text NOT NULL,
  vendor_type text,
  location_id text,
  active boolean NOT NULL DEFAULT true,
  notes text,
  mirrored_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cr02.locations (
  location_id text PRIMARY KEY,
  country text,
  province text,
  district text,
  municipality_city text,
  ward text,
  notes text,
  mirrored_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cr02.rate_observations (
  rate_observation_id text PRIMARY KEY,
  subject_type text NOT NULL,
  subject_id text NOT NULL,
  variant_spec text,
  vendor_id text REFERENCES cr02.vendors(vendor_id),
  location_id text REFERENCES cr02.locations(location_id),
  unit text NOT NULL,
  rate_npr numeric(20,6) NOT NULL CHECK (rate_npr >= 0),
  rate_basis text,
  effective_date date,
  valid_to date,
  source_id text NOT NULL REFERENCES cr02.sources(source_id),
  project_id text,
  tax_included text,
  transport_included text,
  status text,
  confidence text,
  notes text,
  source_sheet text NOT NULL DEFAULT '11_Rate_Observations',
  source_row_number integer,
  mirrored_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cr02.rate_analysis (
  rate_analysis_id text PRIMARY KEY,
  work_item_id text NOT NULL REFERENCES cr02.work_items(work_item_id),
  variant_mix text,
  output_unit text NOT NULL,
  output_qty numeric(20,6),
  material_cost numeric(20,6),
  labour_cost numeric(20,6),
  equipment_cost numeric(20,6),
  transport_cost numeric(20,6),
  other_direct_cost numeric(20,6),
  direct_cost numeric(20,6),
  oh_percent numeric(10,4),
  profit_percent numeric(10,4),
  client_unit_rate numeric(20,6),
  location_text text,
  effective_date date,
  calculation_link text,
  visibility text,
  notes text,
  mirrored_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cr02.rate_analysis_sources (
  rate_analysis_id text NOT NULL REFERENCES cr02.rate_analysis(rate_analysis_id) ON DELETE CASCADE,
  source_id text NOT NULL REFERENCES cr02.sources(source_id),
  PRIMARY KEY(rate_analysis_id,source_id)
);

CREATE TABLE cr02.rate_analysis_components (
  analysis_component_id text PRIMARY KEY,
  rate_analysis_id text NOT NULL REFERENCES cr02.rate_analysis(rate_analysis_id) ON DELETE CASCADE,
  component_type text NOT NULL,
  component_id text NOT NULL,
  qty_per_output numeric(20,8) NOT NULL CHECK (qty_per_output >= 0),
  unit text NOT NULL,
  rate_observation_id text REFERENCES cr02.rate_observations(rate_observation_id),
  extended_cost_npr numeric(20,6),
  basis text,
  notes text,
  mirrored_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cr02.project_source_bridge (
  project_source_bridge_id text PRIMARY KEY,
  project_id text NOT NULL,
  company_project_code text,
  owning_company text,
  source_id text NOT NULL REFERENCES cr02.sources(source_id),
  relationship_role text,
  milestone_handle text,
  evidence_drive_link text,
  visibility text,
  notes text,
  mirrored_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cr02.identifier_aliases (
  alias_namespace text NOT NULL,
  alias_id text NOT NULL,
  canonical_entity_type text NOT NULL,
  canonical_id text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(alias_namespace,alias_id)
);

CREATE TABLE cr02.authority_state (
  authority_key text PRIMARY KEY,
  authority_value text NOT NULL,
  notes text,
  verified_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cr02_ro_subject ON cr02.rate_observations(subject_type,subject_id);
CREATE INDEX idx_cr02_ro_source ON cr02.rate_observations(source_id);
CREATE INDEX idx_cr02_ro_location_date ON cr02.rate_observations(location_id,effective_date DESC);
CREATE INDEX idx_cr02_ra_work ON cr02.rate_analysis(work_item_id);

CREATE VIEW cr02.v_current_rate_observations AS
SELECT DISTINCT ON (subject_type,subject_id,COALESCE(location_id,''))
  rate_observation_id,subject_type,subject_id,variant_spec,vendor_id,location_id,unit,rate_npr,
  rate_basis,effective_date,valid_to,source_id,project_id,tax_included,transport_included,status,confidence,notes
FROM cr02.rate_observations
WHERE COALESCE(status,'') <> 'Superseded'
ORDER BY subject_type,subject_id,COALESCE(location_id,''),effective_date DESC NULLS LAST,rate_observation_id DESC;

CREATE VIEW cr02.v_rate_analysis_component_costs AS
SELECT
  c.analysis_component_id,
  c.rate_analysis_id,
  c.component_type,
  c.component_id,
  c.qty_per_output,
  c.unit AS component_unit,
  c.rate_observation_id,
  r.rate_npr,
  CASE WHEN r.rate_npr IS NULL THEN NULL
       ELSE c.qty_per_output * r.rate_npr END AS calculated_extended_cost_npr,
  c.extended_cost_npr AS source_extended_cost_npr,
  c.basis,
  c.notes
FROM cr02.rate_analysis_components c
LEFT JOIN cr02.rate_observations r ON r.rate_observation_id=c.rate_observation_id;
