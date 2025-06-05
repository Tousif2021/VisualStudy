/*
  # Initial Schema for Visual Study App
  
  1. New Tables
    - `users` - Extended user profile information
    - `courses` - User courses
    - `documents` - Files uploaded for each course
    - `tasks` - User tasks and assignments
    - `notes` - User notes for courses or standalone
    - `quizzes` - Generated quizzes for documents
    - `quiz_questions` - Questions for each quiz
    - `quiz_results` - User quiz results
    - `flashcards` - Flashcards generated from documents
    
  2. Security
    - Row Level Security (RLS) enabled for all tables
    - Policies to ensure users can only access their own data
*/

-- Create schema for user profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create schema for courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create schema for documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create schema for tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create schema for notes
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create schema for quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create schema for quiz questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create schema for quiz results
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create schema for flashcards
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Set up storage for document files
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policies for courses
CREATE POLICY "Users can view own courses" 
  ON public.courses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own courses" 
  ON public.courses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own courses" 
  ON public.courses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own courses" 
  ON public.courses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policies for documents
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

-- Policies for tasks
CREATE POLICY "Users can view own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policies for notes
CREATE POLICY "Users can view own notes" 
  ON public.notes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" 
  ON public.notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" 
  ON public.notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" 
  ON public.notes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policies for quizzes (based on document ownership)
CREATE POLICY "Users can view quizzes for their documents" 
  ON public.quizzes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.documents 
      JOIN public.courses ON documents.course_id = courses.id
      WHERE quizzes.document_id = documents.id 
      AND courses.user_id = auth.uid()
    )
  );

-- Policies for quiz questions (based on quiz ownership)
CREATE POLICY "Users can view quiz questions for their quizzes" 
  ON public.quiz_questions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      JOIN public.documents ON quizzes.document_id = documents.id
      JOIN public.courses ON documents.course_id = courses.id
      WHERE quiz_questions.quiz_id = quizzes.id 
      AND courses.user_id = auth.uid()
    )
  );

-- Policies for quiz results
CREATE POLICY "Users can view own quiz results" 
  ON public.quiz_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results" 
  ON public.quiz_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policies for flashcards (based on document ownership)
CREATE POLICY "Users can view flashcards for their documents" 
  ON public.flashcards 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.documents 
      JOIN public.courses ON documents.course_id = courses.id
      WHERE flashcards.document_id = documents.id 
      AND courses.user_id = auth.uid()
    )
  );

-- Policy for storage
CREATE POLICY "Users can upload to their own folders" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    (bucket_id = 'documents') AND 
    (auth.uid()::text = (storage.foldername(name))[1])
  );

CREATE POLICY "Users can access their own files" 
  ON storage.objects 
  FOR SELECT 
  USING (
    (bucket_id = 'documents') AND 
    (auth.uid()::text = (storage.foldername(name))[1])
  );

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();