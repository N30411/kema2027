-- Honlly Isaac NGE 2027 - Morobe Regional Campaign Database
-- PostgreSQL Schema for Supabase

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'campaign_manager', 'agent')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS llgs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  llg_id UUID NOT NULL REFERENCES llgs(id) ON DELETE CASCADE,
  councilor TEXT,
  population INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS supporters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  phone TEXT NOT NULL,
  occupation TEXT,
  ward_id UUID NOT NULL REFERENCES wards(id) ON DELETE CASCADE,
  llg_id UUID NOT NULL REFERENCES llgs(id) ON DELETE CASCADE,
  support_level TEXT NOT NULL CHECK (support_level IN ('Strong', 'Leaning', 'Undecided', 'Opposition')),
  registered_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  attendance INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_supporters_ward_id ON supporters(ward_id);
CREATE INDEX idx_supporters_llg_id ON supporters(llg_id);
CREATE INDEX idx_supporters_registered_by ON supporters(registered_by);
CREATE INDEX idx_supporters_support_level ON supporters(support_level);
CREATE INDEX idx_wards_llg_id ON wards(llg_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow_admin_all" ON supporters;
DROP POLICY IF EXISTS "allow_campaign_manager_read" ON supporters;
DROP POLICY IF EXISTS "allow_agent_read_own" ON supporters;
DROP POLICY IF EXISTS "allow_agent_create" ON supporters;
DROP POLICY IF EXISTS "allow_agent_update_own" ON supporters;

-- Enable Row Level Security
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE llgs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for supporters table
-- Admins can do everything
CREATE POLICY "admin_full_access" ON supporters
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Campaign managers can read all, create, and update
CREATE POLICY "campaign_manager_read_all" ON supporters
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'campaign_manager'
    )
  );

CREATE POLICY "campaign_manager_create" ON supporters
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'campaign_manager'
    )
  );

CREATE POLICY "campaign_manager_update" ON supporters
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'campaign_manager'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'campaign_manager'
    )
  );

-- Agents can read only their own records
CREATE POLICY "agent_read_own" ON supporters
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'agent'
    )
    AND registered_by = auth.uid()
  );

-- Agents can create supporters
CREATE POLICY "agent_create" ON supporters
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'agent'
    )
    AND registered_by = auth.uid()
  );

-- Agents can update only their own records
CREATE POLICY "agent_update_own" ON supporters
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'agent'
    )
    AND registered_by = auth.uid()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'agent'
    )
    AND registered_by = auth.uid()
  );

-- Agents cannot delete
CREATE POLICY "agent_no_delete" ON supporters
  FOR DELETE
  USING (false);

-- Events RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_read_events" ON events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "admin_can_manage_events" ON events
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- LLGs RLS
ALTER TABLE llgs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read LLGs
CREATE POLICY "users_can_read_llgs" ON llgs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid()
    )
  );

-- (Optional) Allow only admins to insert/update/delete LLGs
CREATE POLICY "admin_manage_llgs" ON llgs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Add councilor and population columns to wards table
ALTER TABLE wards ADD COLUMN councilor TEXT;
ALTER TABLE wards ADD COLUMN population INTEGER;

-- Allow all authenticated users to insert and read wards
CREATE POLICY "users_can_insert_wards" ON wards
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "users_can_read_wards" ON wards
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid()
    )
  );
