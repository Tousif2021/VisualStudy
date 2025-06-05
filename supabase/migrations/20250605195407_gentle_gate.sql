/*
  # Add profile fields
  
  1. Changes
    - Add institution field to profiles table
    - Add name field to profiles table
    - Update RLS policies
*/

-- Add new fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS institution TEXT,
ADD COLUMN IF NOT EXISTS name TEXT;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);