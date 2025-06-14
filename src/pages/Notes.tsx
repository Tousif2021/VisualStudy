import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, ChevronDown, ChevronRight, Folder, Trash2, Camera, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import NoteEditor from '../components/notes/NoteEditor';
import { DocumentScanner } from '../components/notes/DocumentScanner';
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
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

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

  const handleNewNote = (courseId: string = '') => {
    // Don't pass 'uncategorized' as a courseId, pass empty string instead
    setSelectedCourseId(courseId === 'uncategorized' ? '' : courseId);
    setSelectedNote(null);
    setShowNoteEditor(true);
  };

  const handleEditNote = (note: any, courseId: string) => {
    setSelectedCourseId(courseId === 'uncategorized' ? '' : courseId);
    setSelectedNote(note);
    setShowNoteEditor(true);
  };

  const handleNoteSave = async () => {
    setShowNoteEditor(false);
    setSelectedNote(null);
    await fetchNotes();
  };

  const handleNoteCancel = () => {
    setShowNoteEditor(false);
    setSelectedNote(null);
  };

  const handleDocumentScanSave = async () => {
    setShowDocumentScanner(false);
    await fetchNotes();
  };

  const handleDeleteNote = async (noteId: string, noteTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${noteTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingNoteId(noteId);
    
    try {
      const { error } = await deleteNote(noteId);
      if (error) throw error;
      
      // Refresh notes list
      await fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    } finally {
      setDeletingNoteId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowDocumentScanner(true)}
            leftIcon={<Camera size={16} />}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Scan Document
          </Button>
          <Button
            onClick={() => handleNewNote()}
            leftIcon={<Plus size={16} />}
          >
            New Note
          </Button>
        </div>
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
            onCancel={handleNoteCancel}
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
                                  handleDeleteNote(note.id, note.title);
                                }}
                                disabled={deletingNoteId === note.id}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-50"
                              >
                                {deletingNoteId === note.id ? (
                                  <Loader2 className="animate-spin" size={14} />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No notes in this course yet</p>
                        <div className="flex justify-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNewNote(courseId)}
                          >
                            Create your first note
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDocumentScanner(true)}
                            leftIcon={<Camera size={14} />}
                          >
                            Scan document
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              )}
            </Card>
          ))}

          {courseNotes.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-500 mb-4">Start by creating your first note or scanning a document</p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => handleNewNote()}
                  leftIcon={<Plus size={16} />}
                >
                  Create Note
                </Button>
                <Button
                  onClick={() => setShowDocumentScanner(true)}
                  leftIcon={<Camera size={16} />}
                  variant="outline"
                >
                  Scan Document
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Document Scanner Modal */}
      {showDocumentScanner && (
        <DocumentScanner
          onClose={() => setShowDocumentScanner(false)}
          onSave={handleDocumentScanSave}
        />
      )}
    </div>
  );
};