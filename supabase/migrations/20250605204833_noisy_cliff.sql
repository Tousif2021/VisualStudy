/*
  # Add Voice Scripts Table
  
  1. New Tables
    - `voice_scripts` - Stores user presentation scripts and audio files
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `content` (text)
      - `audio_url` (text, optional)
      - `recording_url` (text, optional)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for user access control
*/

-- Create voice_scripts table
CREATE TABLE IF NOT EXISTS public.voice_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audio_url TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.voice_scripts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own voice scripts"
  ON public.voice_scripts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own voice scripts"
  ON public.voice_scripts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice scripts"
  ON public.voice_scripts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice scripts"
  ON public.voice_scripts
  FOR DELETE
  USING (auth.uid() = user_id);