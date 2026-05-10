-- Chad CMS - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'intake',
  priority TEXT NOT NULL DEFAULT 'P2',
  owner TEXT DEFAULT 'Chad',
  due_date DATE,
  tags TEXT[],
  approval_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ventures Table
CREATE TABLE ventures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'backlog',
  rank INTEGER,
  score INTEGER,
  target_market TEXT,
  value_proposition TEXT,
  time_to_revenue TEXT,
  startup_cost TEXT,
  month1_revenue TEXT,
  month12_revenue TEXT,
  automation_level TEXT,
  execution_plan JSONB,
  tools_needed TEXT[],
  risks TEXT[],
  mitigation TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finances Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- 'income' or 'expense'
  amount DECIMAL(10,2) NOT NULL,
  category TEXT,
  description TEXT,
  venture_id UUID REFERENCES ventures(id),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents Table (optional - can read from OpenClaw config)
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT,
  status TEXT DEFAULT 'idle',
  model TEXT,
  workspace TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_ventures_status ON ventures(status);
CREATE INDEX idx_ventures_rank ON ventures(rank);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(date);

-- Insert sample data (optional)
INSERT INTO ventures (name, description, status, rank, score, time_to_revenue, startup_cost, month12_revenue) VALUES
('AI Automation Services', 'Freelance + retainer automation consulting', 'active', 1, 46, '3-7 days', '€19', '€8K'),
('Digital Products', 'Notion templates + AI prompts', 'active', 2, 44, '7-14 days', '€0-€30', '€5K'),
('YouTube Automation', 'Faceless AI channels', 'backlog', 3, 36, '30-60 days', '€50-€100', '€5K'),
('Substack Newsletter', 'Paid subscription newsletter', 'backlog', 4, 37, '30-90 days', '€0', '€5K'),
('Stock/Crypto AI Tool', 'SaaS for market analysis', 'backlog', 5, 32, '60-90 days', '€100-€500', '€5K+');
