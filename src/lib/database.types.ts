export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          user_id: string;
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
        };
        Insert: {
          id?: string;
          user_id: string;
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
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
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
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          course_id: string;
          chapter_id?: string;
          topic_id?: string;
          name: string;
          file_path: string;
          file_type: string;
          tags: string[];
          size: number;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          chapter_id?: string;
          topic_id?: string;
          name: string;
          file_path: string;
          file_type: string;
          tags?: string[];
          size: number;
          content?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          chapter_id?: string;
          topic_id?: string;
          name?: string;
          file_path?: string;
          file_type?: string;
          tags?: string[];
          size?: number;
          content?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          course_id?: string;
          title: string;
          description: string;
          due_date: string;
          priority: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id?: string;
          title: string;
          description: string;
          due_date: string;
          priority: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          title?: string;
          description?: string;
          due_date?: string;
          priority?: string;
          status?: string;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          course_id?: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id?: string;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          document_id: string;
          title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          title: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          title?: string;
          created_at?: string;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question: string;
          options: string[];
          correct_answer: string;
          explanation: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question: string;
          options: string[];
          correct_answer: string;
          explanation: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          question?: string;
          options?: string[];
          correct_answer?: string;
          explanation?: string;
        };
      };
      quiz_results: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          score: number;
          total_questions: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          score: number;
          total_questions: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string;
          score?: number;
          total_questions?: number;
          created_at?: string;
        };
      };
      flashcards: {
        Row: {
          id: string;
          document_id: string;
          front: string;
          back: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          front: string;
          back: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          front?: string;
          back?: string;
          created_at?: string;
        };
      };
      ai_recommendations: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          topic: string;
          recommendation: string;
          priority: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          topic: string;
          recommendation: string;
          priority: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          topic?: string;
          recommendation?: string;
          priority?: string;
          created_at?: string;
        };
      };
      external_links: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          description: string | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          description?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          url?: string;
          description?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          mood?: string;
          tags: string[];
          is_locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          mood?: string;
          tags?: string[];
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          mood?: string;
          tags?: string[];
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      journal_settings: {
        Row: {
          id: string;
          user_id: string;
          passcode_hash?: string;
          auto_lock_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          passcode_hash?: string;
          auto_lock_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          passcode_hash?: string;
          auto_lock_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      voice_scripts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          audio_url?: string;
          recording_url?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          audio_url?: string;
          recording_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          audio_url?: string;
          recording_url?: string;
          created_at?: string;
        };
      };
    };
  };
}