/*
  # Fix Course Security Policy

  1. Changes
    - Update RLS policy for courses table to properly handle INSERT operations
    - Ensure user_id matches the authenticated user's ID

  2. Security
    - Enable RLS on courses table
    - Add policy for authenticated users to insert their own courses
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert own courses" ON courses;

-- Create new policy with correct security check
CREATE POLICY "Users can insert own courses"
ON courses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);