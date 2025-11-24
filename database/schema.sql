-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- Optional if using Supabase Auth
  full_name TEXT,
  nationality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Visa Types
CREATE TABLE IF NOT EXISTS visa_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,     -- e.g. 'E-7', 'D-10', 'F-2'
  subcode TEXT,           -- e.g. 'E-7-1', 'E-7-4', 'D-10-T'
  name_ko TEXT NOT NULL,
  name_en TEXT,
  category TEXT NOT NULL, -- 'employment', 'study', 'residence'
  is_points_based BOOLEAN NOT NULL DEFAULT false,
  is_top_tier BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  manual_ref TEXT,        -- e.g. "Manual p.169-185"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Visa Rules (JSONB for flexibility)
CREATE TABLE IF NOT EXISTS visa_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID NOT NULL REFERENCES visa_types(id) ON DELETE CASCADE,
  eligibility JSONB NOT NULL DEFAULT '{}',   -- Requirements
  disqualifiers JSONB DEFAULT '[]',          -- Disqualification reasons
  income_rules JSONB DEFAULT '{}',           -- GNI multiples, etc.
  special_notes JSONB DEFAULT '{}',          -- Special exceptions
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Score Tables (for Point-based Visas)
CREATE TABLE IF NOT EXISTS score_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID NOT NULL REFERENCES visa_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,     -- e.g. 'F-2-7 Standard 2025'
  total_points INTEGER NOT NULL,
  pass_points INTEGER NOT NULL,
  meta JSONB DEFAULT '{}', -- version info, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Score Items (Individual criteria)
CREATE TABLE IF NOT EXISTS score_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score_table_id UUID NOT NULL REFERENCES score_tables(id) ON DELETE CASCADE,
  code TEXT NOT NULL,   -- 'AGE', 'DEGREE', 'INCOME', 'KOREAN'
  label_ko TEXT NOT NULL,
  label_en TEXT,
  weight_max INTEGER NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',  -- Scoring rules/intervals
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 6. Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id), -- Can be nullable for guest users
  visa_type_id UUID REFERENCES visa_types(id),
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'submitted', 'completed'
  profile_data JSONB NOT NULL DEFAULT '{}',
  recommended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Application Scores (Calculated results)
CREATE TABLE IF NOT EXISTS application_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  score_table_id UUID NOT NULL REFERENCES score_tables(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Forms (PDF Templates)
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,   -- 'B34', 'B21'
  name_ko TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path to template file
  version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Form Fields (Coordinates)
CREATE TABLE IF NOT EXISTS form_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  label_ko TEXT,
  page INTEGER NOT NULL DEFAULT 0,
  x NUMERIC NOT NULL,
  y NUMERIC NOT NULL,
  font_size NUMERIC NOT NULL DEFAULT 10,
  width NUMERIC,
  height NUMERIC,
  alignment TEXT DEFAULT 'left'
);

-- 10. Form Mappings (Data -> Field)
CREATE TABLE IF NOT EXISTS form_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  visa_type_id UUID REFERENCES visa_types(id),
  field_id UUID NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
  source_path TEXT NOT NULL, -- e.g. 'applicant.fullNameKo'
  required BOOLEAN NOT NULL DEFAULT false
);

-- 11. Checklists (Documents)
CREATE TABLE IF NOT EXISTS checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID NOT NULL REFERENCES visa_types(id) ON DELETE CASCADE,
  nationality TEXT, -- 'ALL' or specific country code
  items JSONB NOT NULL DEFAULT '[]', -- List of required documents
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Posts (Bulletin Board)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'News',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
