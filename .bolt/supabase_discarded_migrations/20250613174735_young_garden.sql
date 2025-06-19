/*
  # Add Journal Feature
  
  1. New Tables
    - `journal_entries` - Stores user journal entries
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `content` (text, encrypted)
      - `mood` (text, optional)
      - `tags` (text array)
      - `is_locked` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `journal_settings` - Stores user journal preferences
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `passcode_hash` (text, optional)
      - `auto_lock_minutes` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
*/

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  tags TEXT[] DEFAULT '{}',
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.journal_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  passcode_hash TEXT,
  auto_lock_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for journal_entries
CREATE POLICY "Users can view own journal entries"
  ON public.journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal entries"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON public.journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON public.journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for journal_settings
CREATE POLICY "Users can view own journal settings"
  ON public.journal_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal settings"
  ON public.journal_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal settings"
  ON public.journal_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_journal_entries_updated_at 
    BEFORE UPDATE ON journal_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_settings_updated_at 
    BEFORE UPDATE ON journal_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();