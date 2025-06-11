import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email: string, password: string, name?: string) => {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name // Include name in user metadata
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Then create/update the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        name: name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Sign in failed');

    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, institution')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      data: {
        user: {
          ...authData.user,
          name: profileData?.name,
          institution: profileData?.institution
        }
      },
      error: null
    };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) return { user: null, error: null };

    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, institution')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    return {
      user: {
        ...user,
        name: profileData?.name,
        institution: profileData?.institution
      },
      error: null
    };
  } catch (error) {
    return { user: null, error };
  }
};

// Profile helpers
export const updateProfile = async (userId: string, data: { name?: string; institution?: string }) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  return { error };
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

export const deleteDocument = async (documentId: string) => {
  try {
    // First get the document to find the file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .single();

    if (fetchError) throw fetchError;

    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path]);

    if (storageError) {
      console.warn('Failed to delete file from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete the document record from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (dbError) throw dbError;

    return { error: null };
  } catch (error) {
    return { error };
  }
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
  courseId?: string,
  color?: string,
  emoji?: string
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
  content: string,
  color?: string,
  emoji?: string
) => {
  const { data, error } = await supabase
    .from('notes')
    .update({ 
      title, 
      content, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', noteId)
    .select();
  
  return { data, error };
};

export const deleteNote = async (noteId: string) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);
  
  return { error };
};