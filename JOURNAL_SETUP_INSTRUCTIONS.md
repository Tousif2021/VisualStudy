# Journal Feature Database Setup

The journal feature requires database tables that haven't been created yet. You need to manually run the migration in your Supabase dashboard.

## Steps to Fix:

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Copy and Run the Migration SQL**
   - **IMPORTANT**: Copy ONLY the SQL code below (not the file path)
   - Paste it into the SQL Editor
   - Click "Run" to execute

```sql
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
```

4. **Verify Tables Were Created**
   - Go to "Table Editor" in the left sidebar
   - You should see two new tables:
     - `journal_entries`
     - `journal_settings`

## What the Migration Creates:

- **journal_entries table**: Stores user journal entries with title, content, mood, tags, and security settings
- **journal_settings table**: Stores user preferences like passcode and auto-lock settings
- **Row Level Security (RLS)**: Ensures users can only access their own data
- **Policies**: Defines what operations users can perform on their data
- **Triggers**: Automatically updates timestamps when records are modified

## After Running the Migration:

The journal feature should work properly and you won't see the "relation does not exist" errors anymore.

## Common Mistakes to Avoid:

- ❌ Don't paste the file path (`supabase/migrations/20250613174735_young_garden.sql`)
- ✅ Copy and paste only the SQL code from inside the migration file
- ❌ Don't run the migration file name as a command
- ✅ Execute the SQL statements in the Supabase SQL Editor