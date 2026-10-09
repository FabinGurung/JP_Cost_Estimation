-- A9 CR-02 Seq9 bounded aggregate-family expansion
-- Canonical authority: AEC_Cost_Rate_Master_v1.0 / SRC-0005
-- Production target: Neon jp_estimation / cr02
-- Tested first on rollback branch br-holy-field-b3pjn81b.
-- IMPORTANT: MAT-GETTI-10-16 remains unresolved and is not bound to RO-1486.

INSERT INTO cr02.materials(material_id,category,generic_name,specification,default_unit,active,notes)
VALUES
('MAT-GETTI-RIVER-SCREENED-WASHED','Aggregate','River aggregate / getti','Screened/washed; all sizes; transport included within Pokhara Valley','m³',true,'SRC-0005 printed p6 / PDF p11; source wording: खोलाको नदीबाट जालीबाट छानेर धोएर ल्याएको गिट्टी सबै साइज; FY 2083/84 government benchmark.'),
('MAT-GETTI-CRUSHED-4.75-40','Aggregate','Crushed aggregate / getti','Crusher machine; 4.75–40 mm','m³',true,'SRC-0005 printed p7 / PDF p12; source wording: क्रसर मेसिनबाट कुटेको गिट्टी (४.७५ बाट ४० मिमि सम्म); FY 2083/84 government benchmark.'),
('MAT-GETTI-CRUSHED-4.75-25','Aggregate','Crushed aggregate / getti','Crusher machine; 4.75–25 mm','m³',true,'SRC-0005 printed p7 / PDF p12; source wording: क्रसर मेसिनबाट कुटेको गिट्टी सानो (४.७५ बाट २५ मिमि सम्म); FY 2083/84 government benchmark.'),
('MAT-GETTI-CRUSHED-40-63','Aggregate','Crushed aggregate / getti','Crusher machine; 40–63 mm','m³',true,'SRC-0005 printed p7 / PDF p12; source wording: क्रसर मेसिनबाट कुटेको गिट्टी मझौला (४० बाट ६३ मिमि सम्म); FY 2083/84 government benchmark.'),
('MAT-GETTI-CRUSHED-63-80','Aggregate','Crushed aggregate / getti','Crusher machine; 63–80 mm','m³',true,'SRC-0005 printed p7 / PDF p12; source wording: क्रसर मेसिनबाट कुटेको गिट्टी ठूलो (६३ बाट ८० मिमि सम्म); FY 2083/84 government benchmark.');

INSERT INTO cr02.rate_observations
(rate_observation_id,subject_type,subject_id,variant_spec,vendor_id,location_id,unit,rate_npr,rate_basis,effective_date,valid_to,source_id,project_id,tax_included,transport_included,status,confidence,notes,source_sheet,source_row_number)
VALUES
('RO-1484','Material','MAT-GETTI-RIVER-SCREENED-WASHED','Screened/washed; all sizes; transport included within Pokhara Valley',NULL,'LOC-0002','m³',2054,'Government benchmark','2026-07-14',NULL,'SRC-0005',NULL,'Unknown','Yes','Current','Published benchmark','SRC-0005 printed p6 / PDF p11; current FY 2083/84 column visually verified; source wording: खोलाको नदीबाट जालीबाट छानेर धोएर ल्याएको गिट्टी सबै साइज.','11_Rate_Observations',1485),
('RO-1485','Material','MAT-GETTI-CRUSHED-4.75-40','Crusher machine; 4.75–40 mm',NULL,'LOC-0002','m³',2107,'Government benchmark','2026-07-14',NULL,'SRC-0005',NULL,'Unknown','Yes','Current','Published benchmark','SRC-0005 printed p7 / PDF p12; current FY 2083/84 column visually verified; source wording: क्रसर मेसिनबाट कुटेको गिट्टी (४.७५ बाट ४० मिमि सम्म).','11_Rate_Observations',1486),
('RO-1486','Material','MAT-GETTI-CRUSHED-4.75-25','Crusher machine; 4.75–25 mm',NULL,'LOC-0002','m³',2164,'Government benchmark','2026-07-14',NULL,'SRC-0005',NULL,'Unknown','Yes','Current','Published benchmark','SRC-0005 printed p7 / PDF p12; current FY 2083/84 column visually verified; source wording: क्रसर मेसिनबाट कुटेको गिट्टी सानो (४.७५ बाट २५ मिमि सम्म).','11_Rate_Observations',1487),
('RO-1487','Material','MAT-GETTI-CRUSHED-40-63','Crusher machine; 40–63 mm',NULL,'LOC-0002','m³',2107,'Government benchmark','2026-07-14',NULL,'SRC-0005',NULL,'Unknown','Yes','Current','Published benchmark','SRC-0005 printed p7 / PDF p12; current FY 2083/84 column visually verified; source wording: क्रसर मेसिनबाट कुटेको गिट्टी मझौला (४० बाट ६३ मिमि सम्म).','11_Rate_Observations',1488),
('RO-1488','Material','MAT-GETTI-CRUSHED-63-80','Crusher machine; 63–80 mm',NULL,'LOC-0002','m³',2107,'Government benchmark','2026-07-14',NULL,'SRC-0005',NULL,'Unknown','Yes','Current','Published benchmark','SRC-0005 printed p7 / PDF p12; current FY 2083/84 column visually verified; source wording: क्रसर मेसिनबाट कुटेको गिट्टी ठूलो (६३ बाट ८० मिमि सम्म).','11_Rate_Observations',1489);
