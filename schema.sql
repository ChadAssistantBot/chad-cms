-- Supabase SQL schema for the 'tasks' table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'intake', -- intake, triage, backlog, ready, in-progress, waiting, review, done
    priority TEXT NOT NULL DEFAULT 'P2', -- P0, P1, P2, P3
    owner TEXT NOT NULL DEFAULT 'Chad',
    due_date DATE,
    tags TEXT[], -- Array of strings for tags
    approval_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Add indexes for performance
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_owner_idx ON tasks(owner);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
