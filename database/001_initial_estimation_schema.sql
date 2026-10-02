-- JP-CES Open Estimation Engine v0.1
-- Canonical Neon/Postgres schema candidate.
-- Tested on temporary Neon migration branch:
-- br-hidden-tooth-b39d1dvz
-- Production not yet applied.

CREATE TABLE projects (
  project_id text PRIMARY KEY,
  project_code text UNIQUE,
  name text NOT NULL,
  location text,
  organization_id text,
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE','HOLD','ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE source_documents (
  source_document_id text PRIMARY KEY,
  source_system text NOT NULL,
  title text NOT NULL,
  provider text,
  document_type text,
  edition text,
  publication_date date,
  source_url text,
  file_hash_sha256 text,
  authority_level text NOT NULL DEFAULT 'REFERENCE'
    CHECK (authority_level IN ('OFFICIAL','PROJECT_AUTHORITY','VENDOR','REFERENCE','RESEARCH')),
  verification_status text NOT NULL DEFAULT 'UNVERIFIED'
    CHECK (verification_status IN ('UNVERIFIED','VERIFIED','SUPERSEDED','REJECTED')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE estimate_versions (
  estimate_version_id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES projects(project_id),
  version_label text NOT NULL,
  estimate_class text,
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','REVIEW','APPROVED','SUPERSEDED','ARCHIVED')),
  basis_notes text,
  supersedes_estimate_version_id text REFERENCES estimate_versions(estimate_version_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, version_label)
);

CREATE TABLE work_items (
  work_id text PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  default_unit text NOT NULL,
  classification_scheme text,
  classification_code text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE quantity_sources (
  quantity_source_id text PRIMARY KEY,
  source_type text NOT NULL
    CHECK (source_type IN ('MANUAL','DRAWING','IFC','BBS','MEP_MODEL','SURVEY','BENCHMARK','OTHER')),
  title text NOT NULL,
  source_document_id text REFERENCES source_documents(source_document_id),
  external_ref text,
  revision text,
  source_hash_sha256 text,
  verification_status text NOT NULL DEFAULT 'UNVERIFIED'
    CHECK (verification_status IN ('UNVERIFIED','VERIFIED','REJECTED','SUPERSEDED')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE boq_items (
  boq_item_id text PRIMARY KEY,
  estimate_version_id text NOT NULL REFERENCES estimate_versions(estimate_version_id) ON DELETE CASCADE,
  parent_boq_item_id text REFERENCES boq_items(boq_item_id),
  work_id text REFERENCES work_items(work_id),
  item_code text NOT NULL,
  description text NOT NULL,
  quantity numeric(20,6) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit text NOT NULL,
  unit_rate numeric(20,6) NOT NULL DEFAULT 0 CHECK (unit_rate >= 0),
  amount numeric(20,6) GENERATED ALWAYS AS (quantity * unit_rate) STORED,
  sort_order integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (estimate_version_id, item_code)
);

CREATE TABLE quantity_records (
  quantity_record_id text PRIMARY KEY,
  estimate_version_id text NOT NULL REFERENCES estimate_versions(estimate_version_id) ON DELETE CASCADE,
  work_id text NOT NULL REFERENCES work_items(work_id),
  boq_item_id text REFERENCES boq_items(boq_item_id) ON DELETE SET NULL,
  quantity_source_id text NOT NULL REFERENCES quantity_sources(quantity_source_id),
  location_ref text,
  quantity numeric(20,6) NOT NULL CHECK (quantity >= 0),
  unit text NOT NULL,
  measurement_method text,
  formula_text text,
  confidence numeric(5,4) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  verification_status text NOT NULL DEFAULT 'UNVERIFIED'
    CHECK (verification_status IN ('UNVERIFIED','VERIFIED','REJECTED','SUPERSEDED')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE resources (
  resource_id text PRIMARY KEY,
  resource_type text NOT NULL
    CHECK (resource_type IN ('LABOUR','MATERIAL','EQUIPMENT','SUBCONTRACT','TRANSPORT','OTHER')),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  default_unit text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rate_books (
  rate_book_id text PRIMARY KEY,
  title text NOT NULL,
  jurisdiction text,
  fiscal_year text,
  effective_from date,
  effective_to date,
  source_document_id text REFERENCES source_documents(source_document_id),
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','VERIFIED','SUPERSEDED','ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rate_items (
  rate_item_id text PRIMARY KEY,
  rate_book_id text NOT NULL REFERENCES rate_books(rate_book_id) ON DELETE CASCADE,
  resource_id text NOT NULL REFERENCES resources(resource_id),
  rate numeric(20,6) NOT NULL CHECK (rate >= 0),
  unit text NOT NULL,
  currency text NOT NULL DEFAULT 'NPR',
  location text,
  source_row_ref text,
  effective_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rate_book_id, resource_id, unit)
);

CREATE TABLE rate_analysis_recipes (
  recipe_id text PRIMARY KEY,
  work_id text NOT NULL REFERENCES work_items(work_id),
  source_document_id text REFERENCES source_documents(source_document_id),
  source_label text,
  revision text,
  output_unit text NOT NULL,
  waste_pct numeric(8,4) NOT NULL DEFAULT 0 CHECK (waste_pct >= 0),
  productivity_note text,
  verification_status text NOT NULL DEFAULT 'UNVERIFIED'
    CHECK (verification_status IN ('UNVERIFIED','VERIFIED','REJECTED','SUPERSEDED')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rate_analysis_components (
  component_id text PRIMARY KEY,
  recipe_id text NOT NULL REFERENCES rate_analysis_recipes(recipe_id) ON DELETE CASCADE,
  resource_id text NOT NULL REFERENCES resources(resource_id),
  coefficient numeric(20,8) NOT NULL CHECK (coefficient >= 0),
  coefficient_unit text NOT NULL,
  waste_factor numeric(12,6) NOT NULL DEFAULT 1 CHECK (waste_factor >= 0),
  notes text,
  UNIQUE (recipe_id, resource_id)
);

CREATE TABLE vendor_quotes (
  vendor_quote_id text PRIMARY KEY,
  project_id text REFERENCES projects(project_id),
  resource_id text NOT NULL REFERENCES resources(resource_id),
  vendor_name text NOT NULL,
  quote_date date NOT NULL,
  rate numeric(20,6) NOT NULL CHECK (rate >= 0),
  unit text NOT NULL,
  currency text NOT NULL DEFAULT 'NPR',
  source_document_id text REFERENCES source_documents(source_document_id),
  status text NOT NULL DEFAULT 'RECEIVED'
    CHECK (status IN ('RECEIVED','REVIEWED','APPROVED','REJECTED','EXPIRED')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE provenance_edges (
  provenance_edge_id text PRIMARY KEY,
  from_entity_type text NOT NULL,
  from_entity_id text NOT NULL,
  relation_type text NOT NULL,
  to_entity_type text NOT NULL,
  to_entity_id text NOT NULL,
  source_document_id text REFERENCES source_documents(source_document_id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE integration_links (
  integration_link_id text PRIMARY KEY,
  project_id text REFERENCES projects(project_id),
  system_name text NOT NULL,
  external_object_type text,
  external_object_id text,
  external_url text,
  local_entity_type text NOT NULL,
  local_entity_id text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE','STALE','SUPERSEDED','BROKEN')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_estimate_versions_project ON estimate_versions(project_id);
CREATE INDEX idx_boq_items_estimate ON boq_items(estimate_version_id);
CREATE INDEX idx_boq_items_work ON boq_items(work_id);
CREATE INDEX idx_quantity_records_estimate ON quantity_records(estimate_version_id);
CREATE INDEX idx_quantity_records_work ON quantity_records(work_id);
CREATE INDEX idx_quantity_records_source ON quantity_records(quantity_source_id);
CREATE INDEX idx_rate_items_book ON rate_items(rate_book_id);
CREATE INDEX idx_rate_items_resource ON rate_items(resource_id);
CREATE INDEX idx_recipe_work ON rate_analysis_recipes(work_id);
CREATE INDEX idx_components_recipe ON rate_analysis_components(recipe_id);
CREATE INDEX idx_provenance_from ON provenance_edges(from_entity_type, from_entity_id);
CREATE INDEX idx_provenance_to ON provenance_edges(to_entity_type, to_entity_id);

CREATE VIEW v_boq_totals AS
SELECT estimate_version_id, SUM(amount) AS direct_total
FROM boq_items
GROUP BY estimate_version_id;

CREATE VIEW v_quantity_summary AS
SELECT
  estimate_version_id,
  work_id,
  unit,
  SUM(quantity) AS total_quantity,
  COUNT(*) AS record_count,
  COUNT(*) FILTER (WHERE verification_status = 'VERIFIED') AS verified_record_count
FROM quantity_records
GROUP BY estimate_version_id, work_id, unit;

CREATE VIEW v_rate_analysis_component_totals AS
SELECT
  r.recipe_id,
  r.work_id,
  c.resource_id,
  c.coefficient,
  c.coefficient_unit,
  c.waste_factor,
  (c.coefficient * c.waste_factor) AS adjusted_coefficient
FROM rate_analysis_recipes r
JOIN rate_analysis_components c ON c.recipe_id = r.recipe_id;
