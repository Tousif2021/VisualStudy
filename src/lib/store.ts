import { create } from 'zustand';
import { supabase, getCurrentUser } from './supabase';
import type { Database } from './database.types';

interface User {
  id: string;
  email: string;
  name?: string;
  institution?: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
}

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
  course_id?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  course_id?: string;
  created_at: string;
  updated_at: string;
}

interface AppState {
  user: User | null;
  courses: Course[];
  currentCourse: Course | null;
  documents: Document[];
  tasks: Task[];
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  initAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  
  // Course actions
  fetchCourses: () => Promise<void>;
  setCurrentCourse: (course: Course | null) => void;
  
  // Document actions
  fetchDocuments: (courseId: string) => Promise<void>;
  
  // Task actions
  fetchTasks: () => Promise<void>;
  
  // Note actions
  fetchNotes: (courseId?: string) => Promise<void>;
  
  // Loading and error states
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  courses: [],
  currentCourse: null,
  documents: [],
  tasks: [],
  notes: [],
  isLoading: false,
  error: null,
  
  // Auth actions
  initAuth: async () => {
    try {
      set({ isLoading: true });
      const { user, error } = await getCurrentUser();
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }
      
      if (user) {
        set({ 
          user: { 
            id: user.id, 
            email: user.email || '',
            name: user.name,
            institution: user.institution
          } 
        });
        
        // Initialize app data
        await get().fetchCourses();
        await get().fetchTasks();
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  },
  
  setUser: (user) => set({ user }),

  signOut: async () => {
    try {
      set({ isLoading: true });
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }
      
      // Clear all app state
      set({
        user: null,
        courses: [],
        currentCourse: null,
        documents: [],
        tasks: [],
        notes: [],
        error: null,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  },
  
  // Course actions
  fetchCourses: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ courses: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  },
  
  setCurrentCourse: (course) => set({ currentCourse: course }),
  
  // Document actions
  fetchDocuments: async (courseId) => {
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('course_id', courseId);
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ documents: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  },
  
  // Task actions
  fetchTasks: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ tasks: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  },
  
  // Note actions
  fetchNotes: async (courseId) => {
    const { user } = get();
    if (!user) return;
    
    try {
      set({ isLoading: true });
      
      let query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id);
      
      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ notes: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  },
  
  // Loading and error states
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));