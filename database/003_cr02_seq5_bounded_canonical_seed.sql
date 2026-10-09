-- A9 CR-02 Seq5 bounded canonical data mirror
-- Source authority: AEC_Cost_Rate_Master_v1.0
-- Drive ID: 1yJX1Dep0_2ZDvRftu3u-Bb6ZbDqtQWKDChQQlYCWYXY
-- Production target: cr02 schema
-- This seed preserves canonical IDs and intentionally leaves RAC rate_observation_id NULL
-- because the live canonical 12_Rate_Analysis_Components sheet leaves those links blank.

INSERT INTO cr02.sources
(source_id,source_type,source_title,issuer_vendor,location_text,source_date_text,valid_from,valid_to,drive_file_id,drive_link,local_original_name,reliability,can_show_client,notes)
VALUES
('SRC-0005','Government Benchmark','Kaski District Rate FY 2083/84','Kaski district rate committee','Kaski / Pokhara','2083-03-30 BS',NULL,NULL,'1RDinUWvdJXICsGUP8CDVDausf-jk_97X','https://drive.google.com/file/d/1RDinUWvdJXICsGUP8CDVDausf-jk_97X/view','जिल्ला_दररेट_आ.व._२०८३_०८४_compressed.pdf','Government','Yes',NULL);

INSERT INTO cr02.locations(location_id,country,province,district,municipality_city,ward,notes)
VALUES
('LOC-0002','Nepal','Gandaki','Kaski','Pokhara',NULL,'Pokhara market / project rate context'),
('LOC-0003','Nepal','Gandaki','Kaski',NULL,NULL,'District benchmark context');

INSERT INTO cr02.work_items(work_item_id,category,plain_name,technical_name,default_unit,description,active,notes)
VALUES
('WRK-0001','Concrete','PCC / concrete topping','Plain Cement Concrete / Concrete Topping','m³','Concrete topping/screed work; mix and thickness stored in rate-analysis record',true,NULL);

INSERT INTO cr02.materials(material_id,category,generic_name,specification,default_unit,active,notes)
VALUES
('MAT-CEMENT-OPC','Concrete / Masonry','OPC Cement','Brand/grade stored in observation/source','bag',true,'Reusable material identity; rate observation not yet normalized here'),
('MAT-CRUSHER-SAND','Aggregate','Crusher Sand','Specification/source stored in observation','m³',true,NULL),
('MAT-RMC-M20','Concrete / RMC','Ready-mixed concrete','M20; transportation Pokhara Valley included','m³',true,'SRC-0005 printed p8 / PDF p13; source heading: Readymixed concrete (with transportation Pokhara Valley); source unit Cum normalized to m³.'),
('MAT-REBAR-FE500-TORSTEEL-10-20MM','Steel / Reinforcement','Fe500 reinforcing bar','TMT / Torsteel; 10–20 mm','kg',true,'SRC-0005 printed p8 / PDF p13; source wording: टि.एम.टि./टोरस्टील (१०-२०) मि.मि.; FY 2083/84 government benchmark. Fe500D +10% source rule preserved separately; no synthetic rate created.'),
('MAT-GETTI-10-16','Aggregate','Getti / coarse aggregate','10–16 mm','m³',true,NULL);

INSERT INTO cr02.rate_observations
(rate_observation_id,subject_type,subject_id,variant_spec,vendor_id,location_id,unit,rate_npr,rate_basis,effective_date,valid_to,source_id,project_id,tax_included,transport_included,status,confidence,notes,source_sheet,source_row_number)
VALUES
('RO-1468','Material','MAT-CEMENT-OPC','50 kg bag; brand/grade not specified on source row',NULL,'LOC-0003','bag',708,'Government benchmark','2026-07-14',NULL,'SRC-0005',NULL,'Unknown','Unknown','Current','Published benchmark','SRC-0005 printed p7 / PDF p12; current FY 2083/84 column visually verified; source wording: सिमेन्ट (५० के.जी.) OPC.','11_Rate_Observations',1469),
('RO-1482','Material','MAT-CRUSHER-SAND','Screened and well-washed prepared sand; transport included within Pokhara Valley',NULL,'LOC-0002','m³',2877,'Government benchmark','2026-07-14',NULL,'SRC-0005',NULL,'Unknown','Yes','Current','Published benchmark','SRC-0005 printed p6 / PDF p11; current FY 2083/84 column visually verified; source wording: क्रसरबाट चालिएको, स्क्रिन गरिएको तथा राम्रो धोएको तयारी बालुवा.','11_Rate_Observations',1483),
('RO-1508','Material','MAT-RMC-M20','M20; transportation Pokhara Valley included',NULL,'LOC-0002','m³',12500,'Government benchmark','2026-07-14',NULL,'SRC-0005',NULL,'Unknown','Yes','Current','Published benchmark','SRC-0005 printed p8 / PDF p13; Readymixed concrete (with transportation Pokhara Valley); current FY 2083/84 column visually verified; source unit Cum normalized to m³.','11_Rate_Observations',1509),
('RO-1514','Material','MAT-REBAR-FE500-TORSTEEL-10-20MM','TMT / Torsteel; 10–20 mm',NULL,'LOC-0003','kg',91,'Government benchmark','2026-07-14',NULL,'SRC-0005',NULL,'Unknown','Unknown','Current','Published benchmark','SRC-0005 printed p8 / PDF p13; Fe500 steel section; current FY 2083/84 column visually verified. Fe500D +10% note is source-derived rule and is not duplicated as an atomic observed rate.','11_Rate_Observations',1515);

INSERT INTO cr02.rate_analysis
(rate_analysis_id,work_item_id,variant_mix,output_unit,output_qty,material_cost,labour_cost,equipment_cost,transport_cost,other_direct_cost,direct_cost,oh_percent,profit_percent,client_unit_rate,location_text,effective_date,calculation_link,visibility,notes)
VALUES
('RA-0001','WRK-0001','1:4 screed; avg thickness 4.5 in','m³',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Pokhara',NULL,'FTS-M1.1','Internal','Rate-analysis record; quantities may reference milestone'),
('RA-0002','WRK-0001','1:3:3 PCC topping; avg thickness 4.5 in','m³',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Pokhara',NULL,'FTS-M2.1','Internal','Rate-analysis record; quantities may reference milestone');

INSERT INTO cr02.rate_analysis_components
(analysis_component_id,rate_analysis_id,component_type,component_id,qty_per_output,unit,rate_observation_id,extended_cost_npr,basis,notes)
VALUES
('RAC-0001','RA-0001','Material','MAT-CEMENT-OPC',7.6657,'bag/m³ output',NULL,NULL,'1:4 screed; dry factor 1.33; bag volume 0.0347 m³','Quantity-only component; bind current cement rate observation when available'),
('RAC-0002','RA-0001','Material','MAT-CRUSHER-SAND',1.064,'m³/m³ output',NULL,NULL,'1:4 screed; dry factor 1.33','Quantity-only component'),
('RAC-0003','RA-0002','Material','MAT-CEMENT-OPC',6.3401,'bag/m³ output',NULL,NULL,'1:3:3 PCC; dry factor 1.54; bag volume 0.0347 m³','Quantity-only component'),
('RAC-0004','RA-0002','Material','MAT-CRUSHER-SAND',0.66,'m³/m³ output',NULL,NULL,'1:3:3 PCC; dry factor 1.54','Quantity-only component'),
('RAC-0005','RA-0002','Material','MAT-GETTI-10-16',0.66,'m³/m³ output',NULL,NULL,'1:3:3 PCC; dry factor 1.54','Quantity-only component');

INSERT INTO cr02.identifier_aliases(alias_namespace,alias_id,canonical_entity_type,canonical_id,status,notes)
VALUES
('JP_ESTIMATION_ENGINE_V0.1','SRC-KASKI-2083-84','SOURCE','SRC-0005','SUPERSEDED_ALIAS','Legacy research-layer Kaski source ID mapped to canonical CR-02 Source_ID; do not use as a competing authority');
