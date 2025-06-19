/*
  # Add course syllabus and document tags
  
  1. Changes
    - Add syllabus JSONB column to courses table
    - Add tags array column to documents table
    - Add chapter_id and topic_id columns to documents table
    
  2. Security
    - Update RLS policies to handle new columns
*/

-- Add syllabus column to courses
ALTER TABLE public.courses
ADD COLUMN syllabus JSONB;

-- Add tags array to documents
ALTER TABLE public.documents
ADD COLUMN tags text[],
ADD COLUMN chapter_id uuid,
ADD COLUMN topic_id uuid;

-- Update document RLS policies
DROP POLICY IF EXISTS "Users can view documents of own courses" ON public.documents;
DROP POLICY IF EXISTS "Users can insert documents into own courses" ON public.documents;
DROP POLICY IF EXISTS "Users can update documents of own courses" ON public.documents;
DROP POLICY IF EXISTS "Users can delete documents of own courses" ON public.documents;

CREATE POLICY "Users can view documents of own courses" 
  ON public.documents 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = documents.course_id 
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents into own courses" 
  ON public.documents 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = documents.course_id 
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update documents of own courses" 
  ON public.documents 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = documents.course_id 
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents of own courses" 
  ON public.documents 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = documents.course_id 
      AND courses.user_id = auth.uid()
    )
  );