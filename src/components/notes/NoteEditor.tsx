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
  onClose: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (noteId: string) => Promise<void>;
  noteToEdit?: any;
  courseId?: string;
  initialNote?: any;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  onClose, 
  onSave, 
  onCancel,
  onDelete,
  noteToEdit, 
  courseId,
  initialNote
}) => {
  const { user, courses } = useAppStore();
  const noteData = noteToEdit || initialNote;

  // Pre-fill if editing
  const [title, setTitle] = useState(noteData?.title ?? '');
  const [content, setContent] = useState(noteData?.content ?? '');
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || noteData?.course_id || '');
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
      
      if (noteData) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            title, 
            content, 
            course_id: selectedCourseId || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', noteData.id);
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
    if (!noteData?.id) return;
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    setDeleteLoading(true);
    setError(null);
    
    try {
      if (onDelete) {
        await onDelete(noteData.id);
      } else {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', noteData.id);
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-2xl rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute left-[-30%] top-[-20%] h-72 w-72 bg-purple-300 opacity-20 rounded-full filter blur-3xl animate-pulse" />
              <div className="absolute right-[-25%] bottom-[-25%] h-64 w-64 bg-blue-200 opacity-20 rounded-full filter blur-3xl animate-pulse" />
            </div>
            
            {/* Header */}
            <CardHeader className="flex flex-row gap-2 justify-between items-start z-10 relative p-6 pb-2 border-b-0">
              <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <FileText size={28} className="text-purple-600" />
                  {noteData ? "Edit Note" : "Create New Note"}
                </h2>
                <p className="text-base text-slate-600 mt-1 font-medium">
                  {noteData ? "Update your note content." : "Write down your thoughts and ideas."}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 rounded-full"
              >
                <X size={24} />
              </Button>
            </CardHeader>
            
            <CardContent className="p-6 pt-0 z-10 relative">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  ref={titleRef}
                  label="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your note a descriptive title..."
                  required
                  className="bg-white/80 border-gray-200/60"
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
                    className="bg-white/80 border-gray-200/60"
                    placeholder="Select a course for this note"
                  />
                )}
                
                <Textarea
                  label="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note content here..."
                  rows={8}
                  className="bg-white/80 border-gray-200/60"
                  required
                  autoResize
                />
                
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-xl"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex justify-between gap-3 pt-4">
                  {/* Delete Button for Edit Mode */}
                  {noteData ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={deleteLoading}
                      onClick={handleDelete}
                      className="rounded-xl px-4 py-2 font-semibold text-red-600 border-red-200 hover:bg-red-50"
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
                  ) : <div />}
                  
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="rounded-xl px-6 py-2 font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-2 font-semibold shadow-lg"
                    >
                      {isLoading && <Loader2 size={16} className="animate-spin mr-2" />}
                      <Save size={16} className="mr-2" />
                      {noteData ? "Update Note" : "Save Note"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};