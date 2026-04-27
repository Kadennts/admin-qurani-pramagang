-- SQL: Create tables for support ticket replies, notes, and reminders
-- Run this in Supabase SQL Editor

-- 1. Ticket Replies
CREATE TABLE IF NOT EXISTS ticket_replies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id text NOT NULL,
  author text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Ticket Notes (internal)
CREATE TABLE IF NOT EXISTS ticket_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id text NOT NULL,
  author text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Ticket Reminders
CREATE TABLE IF NOT EXISTS ticket_reminders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id text NOT NULL,
  title text NOT NULL,
  datetime timestamptz,
  staff text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (optional - adjust to your policies)
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_reminders ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all for authenticated" ON ticket_replies FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON ticket_notes FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON ticket_reminders FOR ALL USING (true);
