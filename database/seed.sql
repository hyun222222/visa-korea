-- Seed Data for Visa Types
INSERT INTO visa_types (code, subcode, name_ko, name_en, category, is_points_based, is_top_tier) VALUES
('E-7', 'E-7-1', '특정활동(전문인력)', 'Specially Designated Activities (Professional)', 'employment', false, false),
('E-7', 'E-7-4', '특정활동(숙련기능인력)', 'Specially Designated Activities (Skilled Worker)', 'employment', true, false),
('E-7', 'E-7-S', '특정활동(첨단산업분야)', 'Specially Designated Activities (Advanced Tech)', 'employment', true, true),
('F-2', 'F-2-7', '거주(우수인재)', 'Residence (Highly Skilled)', 'residence', true, false),
('D-10', 'D-10-1', '구직(일반)', 'Job Seeker (General)', 'job_search', true, false),
('D-10', 'D-10-T', '구직(첨단기술인재)', 'Job Seeker (High-Tech)', 'job_search', true, true);

-- Seed Data for Forms
INSERT INTO forms (code, name_ko, file_path, version) VALUES
('B34', '통합신청서(신고서)', '/forms/integrated_application_34.pdf', '2025.01'),
('B21', '사증발급인정신청서', '/forms/visa_issuance_21.pdf', '2025.01');

-- Example Score Table for F-2-7 (Simplified)
WITH f27 AS (SELECT id FROM visa_types WHERE subcode = 'F-2-7' LIMIT 1)
INSERT INTO score_tables (visa_type_id, name, total_points, pass_points, meta) 
SELECT id, 'F-2-7 Standard 2025', 130, 80, '{"version": "2025.11"}' FROM f27;
