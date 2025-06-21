import { create } from 'zustand';
import { supabase, getCurrentUser } from './supabase';
import type { Database } from './database.types';

interface VoiceScript {
  id: string;
  user_id: string;
  title: string;
  content: string;
  audio_url?: string;
  recording_url?: string;
  created_at: string;
}

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
  syllabus?: {
    chapters: {
      id: string;
      title: string;
      description: string;
      completed: boolean;
      topics: {
        id: string;
        title: string;
        completed: boolean;
      }[];
    }[];
  };
  created_at: string;
}

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  course_id: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
  course_id?: string;
  created_at?: string;
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
  voiceScripts: VoiceScript[];
  
  // Auth actions
  initAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  
  // Course actions
  fetchCourses: () => Promise<void>;
  setCurrentCourse: (course: Course | null) => void;
  
  // Document actions
  fetchDocuments: (courseId?: string) => Promise<void>;
  
  // Task actions
  fetchTasks: () => Promise<void>;
  
  // Note actions
  fetchNotes: (courseId?: string) => Promise<void>;
  
  // Loading and error states
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Voice coach actions
  fetchVoiceScripts: () => Promise<void>;
  createVoiceScript: (title: string, content: string) => Promise<VoiceScript | null>;
  updateVoiceScript: (id: string, data: Partial<VoiceScript>) => Promise<void>;
  deleteVoiceScript: (id: string) => Promise<void>;
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
  voiceScripts: [],
  
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
        await get().fetchNotes(); // Fetch all notes on init
        await get().fetchDocuments(); // Fetch all documents on init
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
  
  // Document actions - Enhanced to handle both course-specific and all documents
  fetchDocuments: async (courseId) => {
    const { user } = get();
    if (!user) return;
    
    try {
      set({ isLoading: true });
      
      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      // If courseId is provided, filter by course, otherwise get all documents for user's courses
      if (courseId) {
        query = query.eq('course_id', courseId);
      } else {
        // Get all documents for user's courses
        const { courses } = get();
        const courseIds = courses.map(course => course.id);
        if (courseIds.length > 0) {
          query = query.in('course_id', courseIds);
        } else {
          // No courses, no documents
          set({ documents: [], isLoading: false });
          return;
        }
      }
      
      const { data, error } = await query;
      
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
  
  // Note actions - Enhanced to handle both course-specific and all notes
  fetchNotes: async (courseId) => {
    const { user } = get();
    if (!user) return;
    
    try {
      set({ isLoading: true });
      
      let query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      // If courseId is provided, filter by course, otherwise get all notes
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
  setError: (error) => set({ error }),
  
  fetchVoiceScripts: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase
        .from('voice_scripts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ voiceScripts: data || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch voice scripts' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createVoiceScript: async (title: string, content: string) => {
    const { user } = get();
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('voice_scripts')
        .insert([{
          user_id: user.id,
          title,
          content,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({
        voiceScripts: [data, ...state.voiceScripts]
      }));
      
      return data;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create voice script' });
      return null;
    }
  },
  
  updateVoiceScript: async (id: string, data: Partial<VoiceScript>) => {
    try {
      const { error } = await supabase
        .from('voice_scripts')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        voiceScripts: state.voiceScripts.map(script =>
          script.id === id ? { ...script, ...data } : script
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update voice script' });
    }
  },
  
  deleteVoiceScript: async (id: string) => {
    try {
      const { error } = await supabase
        .from('voice_scripts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        voiceScripts: state.voiceScripts.filter(script => script.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete voice script' });
    }
  }
}));