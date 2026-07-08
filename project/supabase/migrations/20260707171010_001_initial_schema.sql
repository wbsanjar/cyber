/*
# Create initial schema for CyberSathi AI

1. New Tables
- `profiles` - Extended user profile data with roles (citizen, police, admin)
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `name` (text)
  - `phone` (text)
  - `role` (enum: citizen, police, admin)
  - `badge_id` (text, nullable - for police/admin)
  - `is_verified` (boolean - for police/admin verification status)
  - `created_at` (timestamp)

- `fraud_reports` - Fraud complaints filed by users
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles.id)
  - `fraud_type` (text)
  - `description` (text)
  - `amount_lost` (decimal)
  - `date_of_fraud` (date)
  - `fraudster_mobile` (text, nullable)
  - `fraudster_upi` (text, nullable)
  - `fraudster_link` (text, nullable)
  - `status` (enum: pending, investigating, resolved, rejected)
  - `risk_score` (integer)
  - `complaint_id` (text - generated complaint reference ID)
  - `created_at` (timestamp)

- `evidence_files` - Uploaded evidence for fraud reports
  - `id` (uuid, primary key)
  - `report_id` (uuid, references fraud_reports.id)
  - `file_name` (text)
  - `file_type` (text)
  - `file_url` (text)
  - `created_at` (timestamp)

- `scam_alerts` - Regional scam alerts and statistics
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `scam_type` (text)
  - `location` (text)
  - `severity` (enum: low, medium, high)
  - `report_count` (integer)
  - `created_at` (timestamp)

- `chat_history` - AI chat conversations
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles.id, nullable for anonymous)
  - `session_id` (uuid)
  - `role` (enum: user, assistant)
  - `content` (text)
  - `language` (enum: hi, en, hinglish)
  - `created_at` (timestamp)

2. Security
- Enable RLS on all tables
- Owner-scoped policies for user data (profiles, fraud_reports, chat_history)
- Public read for scam_alerts
- Proper cascade deletes for evidence_files

3. Important Notes
- This is a multi-user app with authentication
- Users have roles: citizen, police, admin
- Police and admin accounts require verification
- Fraud reports are private to the user who created them
- Scam alerts are public information
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('citizen', 'police', 'admin');
CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'rejected');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE message_role AS ENUM ('user', 'assistant');
CREATE TYPE language_type AS ENUM ('hi', 'en', 'hinglish');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  phone text,
  role user_role NOT NULL DEFAULT 'citizen',
  badge_id text,
  is_verified boolean DEFAULT false,
  cyber_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create fraud_reports table
CREATE TABLE IF NOT EXISTS fraud_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fraud_type text NOT NULL,
  description text,
  amount_lost decimal DEFAULT 0,
  date_of_fraud date,
  fraudster_mobile text,
  fraudster_upi text,
  fraudster_link text,
  status report_status NOT NULL DEFAULT 'pending',
  risk_score integer DEFAULT 0,
  complaint_id text,
  created_at timestamptz DEFAULT now()
);

-- Create evidence_files table
CREATE TABLE IF NOT EXISTS evidence_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES fraud_reports(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text,
  file_url text,
  created_at timestamptz DEFAULT now()
);

-- Create scam_alerts table
CREATE TABLE IF NOT EXISTS scam_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  scam_type text NOT NULL,
  location text NOT NULL,
  severity severity_level NOT NULL DEFAULT 'medium',
  report_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id uuid NOT NULL DEFAULT gen_random_uuid(),
  role message_role NOT NULL,
  content text NOT NULL,
  language language_type DEFAULT 'hinglish',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Fraud reports policies
DROP POLICY IF EXISTS "Users can view own reports" ON fraud_reports;
CREATE POLICY "Users can view own reports"
ON fraud_reports FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create reports" ON fraud_reports;
CREATE POLICY "Users can create reports"
ON fraud_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reports" ON fraud_reports;
CREATE POLICY "Users can update own reports"
ON fraud_reports FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Evidence files policies
DROP POLICY IF EXISTS "Users can view evidence for own reports" ON evidence_files;
CREATE POLICY "Users can view evidence for own reports"
ON evidence_files FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fraud_reports
    WHERE fraud_reports.id = evidence_files.report_id
    AND fraud_reports.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can upload evidence for own reports" ON evidence_files;
CREATE POLICY "Users can upload evidence for own reports"
ON evidence_files FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM fraud_reports
    WHERE fraud_reports.id = evidence_files.report_id
    AND fraud_reports.user_id = auth.uid()
  )
);

-- Scam alerts policies (public read)
DROP POLICY IF EXISTS "Anyone can view scam alerts" ON scam_alerts;
CREATE POLICY "Anyone can view scam alerts"
ON scam_alerts FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create alerts" ON scam_alerts;
CREATE POLICY "Authenticated users can create alerts"
ON scam_alerts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Chat history policies
DROP POLICY IF EXISTS "Users can view own chat history" ON chat_history;
CREATE POLICY "Users can view own chat history"
ON chat_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can add to chat history" ON chat_history;
CREATE POLICY "Users can add to chat history"
ON chat_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fraud_reports_user_id ON fraud_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_status ON fraud_reports(status);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_created_at ON fraud_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scam_alerts_location ON scam_alerts(location);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);

-- Function to generate complaint ID and update the record
CREATE OR REPLACE FUNCTION set_complaint_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.complaint_id IS NULL THEN
    NEW.complaint_id := 'CSF/' || EXTRACT(YEAR FROM now())::text || '/' || LPAD(floor(random() * 100000)::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate complaint ID
DROP TRIGGER IF EXISTS set_complaint_id_trigger ON fraud_reports;
CREATE TRIGGER set_complaint_id_trigger
BEFORE INSERT ON fraud_reports
FOR EACH ROW
EXECUTE FUNCTION set_complaint_id();
