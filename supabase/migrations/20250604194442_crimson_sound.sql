/*
  # Add AI Recommendations

  1. New Tables
    - `ai_recommendations` - Stores AI-generated study recommendations
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `course_id` (uuid, references courses)
      - `topic` (text)
      - `recommendation` (text)
      - `priority` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `ai_recommendations` table
    - Add policies for user access control
*/

CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own recommendations"
  ON public.ai_recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "AI can insert recommendations"
  ON public.ai_recommendations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);