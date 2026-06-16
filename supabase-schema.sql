-- Run this in your Supabase SQL editor
-- Go to: supabase.com → your project → SQL Editor → New Query

CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  type TEXT CHECK (type IN ('work', 'short_break', 'long_break')) NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast date queries
CREATE INDEX idx_sessions_date ON sessions(date);

-- Enable Row Level Security (optional but good practice)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict this later with auth)
CREATE POLICY "Allow all" ON sessions FOR ALL USING (true);
