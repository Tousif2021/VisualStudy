/*
  # Add External Links Feature
  
  1. New Tables
    - `external_links` - Stores user-saved external resources
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `url` (text)
      - `description` (text, nullable)
      - `tags` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for user access control
*/

CREATE TABLE IF NOT EXISTS public.external_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own links"
  ON public.external_links
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own links"
  ON public.external_links
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links"
  ON public.external_links
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links"
  ON public.external_links
  FOR DELETE
  USING (auth.uid() = user_id);