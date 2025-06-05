import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Course helpers
export const getCourses = async (userId: string) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
};

export const createCourse = async (userId: string, name: string, description: string) => {
  const { data, error } = await supabase
    .from('courses')
    .insert([{ user_id: userId, name, description }])
    .select();
  
  return { data, error };
};

// Document helpers
export const getDocuments = async (courseId: string) => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('course_id', courseId);
  
  return { data, error };
};

export const uploadDocument = async (courseId: string, userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${userId}/${courseId}/${fileName}`;

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) {
    return { error: uploadError };
  }

  // Create document record in database
  const { data, error } = await supabase
    .from('documents')
    .insert([{ 
      course_id: courseId, 
      name: file.name, 
      file_path: filePath,
      file_type: fileExt,
      size: file.size 
    }])
    .select();

  return { data, error };
};

// Task helpers
export const getTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true });
  
  return { data, error };
};

export const createTask = async (
  userId: string, 
  title: string, 
  description: string, 
  dueDate: string, 
  priority: string,
  courseId?: string
) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ 
      user_id: userId, 
      title, 
      description, 
      due_date: dueDate, 
      priority,
      course_id: courseId,
      status: 'pending' 
    }])
    .select();
  
  return { data, error };
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select();
  
  return { data, error };
};

// Notes helpers
export const getNotes = async (userId: string, courseId?: string) => {
  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId);
  
  if (courseId) {
    query = query.eq('course_id', courseId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createNote = async (
  userId: string, 
  title: string, 
  content: string, 
  courseId?: string
) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ 
      user_id: userId, 
      title, 
      content, 
      course_id: courseId 
    }])
    .select();
  
  return { data, error };
};

export const updateNote = async (
  noteId: string,
  title: string,
  content: string
) => {
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', noteId)
    .select();
  
  return { data, error };
};