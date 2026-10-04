import { neon } from "@neondatabase/serverless";

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900"
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  const connectionString = process.env.CR02_DATABASE_URL;
  if (!connectionString) {
    return res.status(503).set(jsonHeaders).json({
      ok: false,
      status: "CONFIG_REQUIRED",
      error: "CR02_DATABASE_URL_MISSING"
    });
  }

  try {
    const sql = neon(connectionString);

    const sources = await sql`
      SELECT
        source_id,
        source_type,
        source_title,
        issuer_vendor,
        location_text,
        source_date_text,
        reliability
      FROM cr02.sources
      ORDER BY source_id
    `;

    const rates = await sql`
      SELECT
        ro.rate_observation_id,
        ro.subject_type,
        ro.subject_id,
        m.generic_name AS material_name,
        m.specification AS material_specification,
        ro.variant_spec,
        ro.location_id,
        COALESCE(l.municipality_city, l.district) AS location_label,
        ro.unit,
        ro.rate_npr,
        ro.rate_basis,
        ro.effective_date,
        ro.source_id,
        ro.tax_included,
        ro.transport_included,
        ro.status,
        ro.confidence
      FROM cr02.rate_observations ro
      LEFT JOIN cr02.materials m ON m.material_id = ro.subject_id
      LEFT JOIN cr02.locations l ON l.location_id = ro.location_id
      ORDER BY ro.rate_observation_id
    `;

    const analyses = await sql`
      SELECT
        ra.rate_analysis_id,
        ra.work_item_id,
        w.plain_name AS work_name,
        ra.variant_mix,
        ra.output_unit,
        ra.output_qty,
        ra.location_text,
        ra.effective_date,
        ra.calculation_link,
        ra.visibility
      FROM cr02.rate_analysis ra
      LEFT JOIN cr02.work_items w ON w.work_item_id = ra.work_item_id
      ORDER BY ra.rate_analysis_id
    `;

    const components = await sql`
      SELECT
        rac.analysis_component_id,
        rac.rate_analysis_id,
        rac.component_type,
        rac.component_id,
        m.generic_name AS material_name,
        rac.qty_per_output,
        rac.unit,
        rac.rate_observation_id,
        rac.extended_cost_npr,
        rac.basis
      FROM cr02.rate_analysis_components rac
      LEFT JOIN cr02.materials m ON m.material_id = rac.component_id
      ORDER BY rac.analysis_component_id
    `;

    return res.status(200).set(jsonHeaders).json({
      ok: true,
      authority: "AEC_Cost_Rate_Master_v1.0",
      mirror: "Neon production cr02",
      mode: "READ_ONLY",
      counts: {
        sources: sources.length,
        rate_observations: rates.length,
        rate_analysis: analyses.length,
        rate_analysis_components: components.length
      },
      sources,
      rates,
      analyses,
      components
    });
  } catch (error) {
    console.error("CR02 read-only API failure", error);
    return res.status(500).set(jsonHeaders).json({
      ok: false,
      status: "QUERY_FAILED",
      error: "CR02_READ_FAILED"
    });
  }
}
