import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, ChevronDown, ChevronRight, Folder, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { NoteEditor } from '../components/notes/NoteEditor';
import { useAppStore } from '../lib/store';
import { deleteNote } from '../lib/supabase';

interface CourseNotes {
  courseId: string;
  courseName: string;
  notes: Array<{
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  }>;
}

export const Notes: React.FC = () => {
  const { courses, notes, fetchCourses, fetchNotes } = useAppStore();
  const [courseNotes, setCourseNotes] = useState<CourseNotes[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCourses(), fetchNotes()]);
    };
    loadData();
  }, [fetchCourses, fetchNotes]);

  useEffect(() => {
    // Organize notes by course
    const notesByCourse = courses.map(course => ({
      courseId: course.id,
      courseName: course.name,
      notes: notes.filter(note => note.course_id === course.id)
    }));

    // Add uncategorized notes
    const uncategorizedNotes = notes.filter(note => !note.course_id);
    if (uncategorizedNotes.length > 0) {
      notesByCourse.push({
        courseId: 'uncategorized',
        courseName: 'Uncategorized Notes',
        notes: uncategorizedNotes
      });
    }

    setCourseNotes(notesByCourse);
  }, [courses, notes]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  const handleNewNote = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedNote(null);
    setShowNoteEditor(true);
  };

  const handleEditNote = (note: any, courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedNote(note);
    setShowNoteEditor(true);
  };

  const handleNoteSave = async () => {
    setShowNoteEditor(false);
    setSelectedNote(null);
    await fetchNotes();
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await deleteNote(noteId);
      if (error) throw error;
      
      // Refresh notes list
      await fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
        <Button
          onClick={() => handleNewNote('')}
          leftIcon={<Plus size={16} />}
        >
          New Note
        </Button>
      </div>

      {showNoteEditor ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <NoteEditor
            courseId={selectedCourseId}
            initialNote={selectedNote}
            onSave={handleNoteSave}
            onCancel={() => setShowNoteEditor(false)}
            onDelete={handleDeleteNote}
          />
        </motion.div>
      ) : (
        <div className="space-y-6">
          {courseNotes.map(({ courseId, courseName, notes: courseNoteList }) => (
            <Card key={courseId}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCourse(courseId)}
              >
                <div className="flex items-center gap-3">
                  <Folder
                    size={20}
                    className={courseId === 'uncategorized' ? 'text-gray-400' : 'text-blue-500'}
                  />
                  <h2 className="text-lg font-semibold">{courseName}</h2>
                  <span className="text-sm text-gray-500">
                    ({courseNoteList.length} notes)
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Plus size={14} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNewNote(courseId);
                    }}
                  >
                    Add Note
                  </Button>
                  {expandedCourses.has(courseId) ? (
                    <ChevronDown size={20} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400" />
                  )}
                </div>
              </div>

              {expandedCourses.has(courseId) && (
                <CardBody className="border-t bg-gray-50">
                  <div className="space-y-3">
                    {courseNoteList.length > 0 ? (
                      courseNoteList.map(note => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer group"
                          onClick={() => handleEditNote(note, courseId)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <FileText size={18} className="text-gray-400 mt-1" />
                              <div className="flex-1">
                                <h3 className="font-medium">{note.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {note.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                Updated {format(new Date(note.updated_at), 'MMM d, yyyy')}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No notes in this course yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleNewNote(courseId)}
                        >
                          Create your first note
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};