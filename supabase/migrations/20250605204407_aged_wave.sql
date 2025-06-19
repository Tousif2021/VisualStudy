/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing RLS policies for profiles table that are causing issues
    - Add new RLS policies that properly handle user registration and profile management
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Creating profiles during registration
      - Viewing own profile
      - Updating own profile
*/

-- First drop existing problematic policies
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add new policies
CREATE POLICY "Enable insert for authentication service" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for users based on user_id" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);