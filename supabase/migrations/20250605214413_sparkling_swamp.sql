/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Create new comprehensive RLS policies that properly handle all operations
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - INSERT: Allow authenticated users to create their own profile
      - SELECT: Allow authenticated users to view their own profile
      - UPDATE: Allow authenticated users to update their own profile
      - DELETE: Prevent deletion (managed through auth.users cascade)
*/

-- First enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for authentication service" ON profiles;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

-- Create new comprehensive policies
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);