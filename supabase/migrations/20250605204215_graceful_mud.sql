/*
  # Add profiles insert policy

  1. Changes
    - Add RLS policy to allow inserting new profiles during registration
    - Policy ensures users can only create their own profile (id matches auth.uid())

  2. Security
    - Maintains data integrity by ensuring users can only create profiles for themselves
    - Works in conjunction with existing RLS policies
*/

CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);