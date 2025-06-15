import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, ChevronDown, ChevronRight, Folder, Trash2, Camera, Loader2, Upload, ExternalLink, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import NoteEditor from '../components/notes/NoteEditor';
import { DocumentScanner } from '../components/notes/DocumentScanner';
import { useAppStore } from '../lib/store';
import { deleteNote, supabase } from '../lib/supabase';

interface CourseContent {
  courseId: string;
  courseName: string;
  notes: Array<{
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    file_path: string;
    file_type: string;
    created_at: string;
  }>;
}

export const Notes: React.FC = () => {
  const { courses, notes, documents, fetchCourses, fetchNotes, fetchDocuments } = useAppStore();
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  
  // Document viewing states
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [documentUrls, setDocumentUrls] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCourses(), fetchNotes(), fetchDocuments()]);
    };
    loadData();
  }, [fetchCourses, fetchNotes, fetchDocuments]);

  useEffect(() => {
    // Organize notes and documents by course
    const contentByCourse = courses.map(course => ({
      courseId: course.id,
      courseName: course.name,
      notes: notes.filter(note => note.course_id === course.id),
      documents: documents.filter(doc => doc.course_id === course.id)
    }));

    // Add uncategorized content
    const uncategorizedNotes = notes.filter(note => !note.course_id);
    const uncategorizedDocuments = documents.filter(doc => !doc.course_id);
    
    if (uncategorizedNotes.length > 0 || uncategorizedDocuments.length > 0) {
      contentByCourse.push({
        courseId: 'uncategorized',
        courseName: 'Uncategorized',
        notes: uncategorizedNotes,
        documents: uncategorizedDocuments
      });
    }

    setCourseContent(contentByCourse);
  }, [courses, notes, documents]);

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
    // Refresh both notes and documents to ensure synchronization
    await Promise.all([fetchNotes(), fetchDocuments()]);
  };

  const handleNoteCancel = () => {
    setShowNoteEditor(false);
    setSelectedNote(null);
  };

  const handleDocumentScanSave = async () => {
    setShowDocumentScanner(false);
    // Refresh both notes and documents to ensure synchronization
    await Promise.all([fetchNotes(), fetchDocuments()]);
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

  // Handle document viewing - same as Course Dashboard
  const handleViewDocument = async (document: any) => {
    if (viewingDocId === document.id) {
      // If already viewing this document, close it
      setViewingDocId(null);
      setDocumentUrls(prev => {
        const newUrls = { ...prev };
        delete newUrls[document.id];
        return newUrls;
      });
      return;
    }

    setViewingDocId(document.id);
    
    try {
      // Get signed URL for the document
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600);

      if (urlError) throw urlError;
      
      setDocumentUrls(prev => ({
        ...prev,
        [document.id]: urlData.signedUrl
      }));
    } catch (error: any) {
      console.error('Error loading document:', error);
      setViewingDocId(null);
    }
  };

  const clearDocumentView = (docId: string) => {
    setViewingDocId(null);
    setDocumentUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[docId];
      return newUrls;
    });
  };

  const getTotalContentCount = (content: CourseContent) => {
    return content.notes.length + content.documents.length;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notes & Documents</h1>
          <p className="text-gray-600 text-sm mt-1">Organize your study materials by course</p>
        </div>
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
          {courseContent.map(({ courseId, courseName, notes: courseNotes, documents: courseDocuments }) => (
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
                    ({getTotalContentCount({ courseId, courseName, notes: courseNotes, documents: courseDocuments })} items)
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
                  <div className="space-y-4">
                    {/* Documents Section */}
                    {courseDocuments.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Upload size={16} />
                          Documents ({courseDocuments.length})
                        </h3>
                        <div className="space-y-3">
                          {courseDocuments.map(document => (
                            <motion.div
                              key={document.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="bg-white rounded-lg shadow-sm border-l-4 border-blue-400 overflow-hidden"
                            >
                              <div className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3 flex-1">
                                    <FileText size={16} className="text-blue-600 mt-1" />
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900">{document.name}</h4>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {document.file_type.toUpperCase()} • Uploaded {format(new Date(document.created_at), 'MMM d, yyyy')}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleViewDocument(document)}
                                    className={`transition-all duration-200 ${
                                      viewingDocId === document.id
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
                                    }`}
                                    leftIcon={<Eye size={14} />}
                                  >
                                    {viewingDocId === document.id ? 'Hide Document' : 'View Document'}
                                  </Button>
                                </div>
                              </div>

                              {/* Document Viewer Display - Same as Course Dashboard */}
                              {viewingDocId === document.id && documentUrls[document.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-gray-200"
                                >
                                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        <Eye size={20} className="text-green-600" />
                                        <h3 className="font-semibold text-green-800">Document Viewer - "{document.name}"</h3>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => clearDocumentView(document.id)}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        ×
                                      </Button>
                                    </div>
                                    
                                    {/* Enhanced Document Viewer */}
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                      {document.file_type === 'pdf' ? (
                                        <div className="space-y-4 p-6">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <FileText size={20} className="text-blue-600" />
                                              <span className="font-medium text-gray-800">PDF Document</span>
                                            </div>
                                            <div className="flex gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(documentUrls[document.id], '_blank')}
                                                leftIcon={<ExternalLink size={14} />}
                                                
                                              >
                                                Open in New Tab
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                  const link = document.createElement('a');
                                                  link.href = documentUrls[document.id];
                                                  link.download = document.name;
                                                  link.click();
                                                }}
                                                leftIcon={<Download size={14} />}
                                                className="border-green-300 text-green-600 hover:bg-green-50"
                                              >
                                                Download
                                              </Button>
                                            </div>
                                          </div>
                                          
                                          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-600 mb-4">
                                              PDF preview is not available due to browser security restrictions.
                                            </p>
                                            <p className="text-gray-600 mb-4">
                                              Click "Open in New Tab" to view the document or "Download" to save it locally.
                                            </p>
                                            <div className="flex justify-center gap-3">
                                              <Button
                                                variant="outline"
                                                onClick={() => window.open(documentUrls[document.id], '_blank')}
                                                leftIcon={<ExternalLink size={16} />}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                              > 
                                                Open in New Tab
                                              </Button>
                                              <Button
                                                variant="outline"
                                                onClick={() => {
                                                  const link = document.createElement('a');
                                                  link.href = documentUrls[document.id];
                                                  link.download = document.name;
                                                  link.click();
                                                }}
                                                leftIcon={<Download size={16} />}
                                              >
                                                Download
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="p-8 text-center">
                                          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                                          <p className="text-gray-600 mb-4">
                                            Preview not available for this file type.
                                          </p>
                                          <div className="flex justify-center gap-3">
                                            <Button
                                              onClick={() => window.open(documentUrls[document.id], '_blank')}
                                              leftIcon={<ExternalLink size={16} />}
                                            >
                                              Open in New Tab
                                            </Button>
                                            <Button
                                              variant="outline"
                                              onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = documentUrls[document.id];
                                                link.download = document.name;
                                                link.click();
                                              }}
                                              leftIcon={<Download size={16} />}
                                            >
                                              Download
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes Section */}
                    {courseNotes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FileText size={16} />
                          Notes ({courseNotes.length})
                        </h3>
                        <div className="space-y-2">
                          {courseNotes.map(note => (
                            <motion.div
                              key={note.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer group border-l-4 border-green-400"
                              onClick={() => handleEditNote(note, courseId)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <FileText size={16} className="text-green-600 mt-1" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{note.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                      {note.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                      Updated {format(new Date(note.updated_at), 'MMM d, yyyy')}
                                    </p>
                                  </div>
                                </div>
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
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {courseNotes.length === 0 && courseDocuments.length === 0 && (
                      <div className="text-center py-8">
                        <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No content in this course yet</p>
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

          {courseContent.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
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