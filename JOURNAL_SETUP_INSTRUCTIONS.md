# Journal Feature Database Setup

The journal feature requires database tables that haven't been created yet. Since we're in WebContainer (which doesn't support Supabase CLI), you need to manually run the migration.

## Steps to Fix:

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the Migration SQL**
   - Copy the entire contents of `supabase/migrations/20250613174735_young_garden.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

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

## Alternative Method:

If you prefer, you can also:
1. Go to "Table Editor" in Supabase Dashboard
2. Click "Create a new table"
3. Manually create the tables using the schema from the migration file

But running the SQL migration is faster and ensures all policies and triggers are set up correctly.