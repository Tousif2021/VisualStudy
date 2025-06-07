import React, { useState, useRef, useEffect } from 'react';
import { X, FileText, Save, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface NoteEditorProps {
  courseId?: string;
  initialNote?: any;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (noteId: string) => Promise<void>;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  courseId,
  initialNote,
  onSave, 
  onCancel,
  onDelete
}) => {
  const { user, courses } = useAppStore();

  // Pre-fill if editing
  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [content, setContent] = useState(initialNote?.content ?? '');
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || initialNote?.course_id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    titleRef.current?.focus(); 
  }, []);

  // Save (add or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (!user?.id) throw new Error('You must be logged in to save notes');
      
      if (initialNote) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            title, 
            content, 
            course_id: selectedCourseId || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', initialNote.id);
        if (error) throw error;
      } else {
        // Create new note
        const { error } = await supabase
          .from('notes')
          .insert([{
            user_id: user.id, 
            title, 
            content, 
            course_id: selectedCourseId || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        if (error) throw error;
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally { 
      setIsLoading(false); 
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!initialNote?.id) return;
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    setDeleteLoading(true);
    setError(null);
    
    try {
      if (onDelete) {
        await onDelete(initialNote.id);
      } else {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', initialNote.id);
        if (error) throw error;
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    } finally { 
      setDeleteLoading(false); 
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row gap-2 justify-between items-start">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText size={24} className="text-purple-600" />
            {initialNote ? "Edit Note" : "Create New Note"}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {initialNote ? "Update your note content." : "Write down your thoughts and ideas."}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={titleRef}
            label="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your note a descriptive title..."
            required
            fullWidth
          />

          {/* Course Selection - only show if not already tied to a specific course */}
          {!courseId && (
            <Select
              label="Course (Optional)"
              value={selectedCourseId}
              onChange={(value) => setSelectedCourseId(value)}
              options={[
                { value: '', label: 'No specific course' },
                ...courses.map((course) => ({
                  value: course.id,
                  label: course.name,
                })),
              ]}
              placeholder="Select a course for this note"
            />
          )}
          
          <Textarea
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            rows={8}
            required
            fullWidth
            autoResize
          />
          
          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="flex justify-between gap-3 pt-4">
            {/* Delete Button for Edit Mode */}
            {initialNote && (
              <Button
                type="button"
                variant="outline"
                disabled={deleteLoading}
                onClick={handleDelete}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </>
                )}
              </Button>
            )}
            
            <div className="flex gap-3 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 size={16} className="animate-spin mr-2" />}
                <Save size={16} className="mr-2" />
                {initialNote ? "Update Note" : "Save Note"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};