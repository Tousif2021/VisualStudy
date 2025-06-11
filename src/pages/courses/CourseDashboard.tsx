import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, FileText, Brain, Edit2, Upload, PlusCircle, X, Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DocumentUpload } from '../../components/documents/DocumentUpload';
import { DocumentViewer } from '../../components/documents/DocumentViewer';
import NoteEditor from '../../components/notes/NoteEditor';
import { TaskManager } from '../../components/tasks/TaskManager';
import { useAppStore } from '../../lib/store';
import { deleteNote, supabase } from '../../lib/supabase';

export function CourseDashboard() {
  const { id } = useParams<{ id: string }>();
  const { courses, fetchCourses, documents, fetchDocuments, notes, fetchNotes, tasks, fetchTasks } = useAppStore();
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState(100);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // Enhanced summarize states
  const [summarizingDocId, setSummarizingDocId] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{[key: string]: string}>({});
  const [summaryErrors, setSummaryErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!courses.length) {
      fetchCourses();
    } else {
      const currentCourse = courses.find(c => c.id === id);
      if (currentCourse) {
        setCourse(currentCourse);
        fetchDocuments(currentCourse.id);
        fetchNotes(currentCourse.id);
        fetchTasks();
      }
    }
  }, [id, courses, fetchCourses, fetchDocuments, fetchNotes, fetchTasks]);

  const handleUploadComplete = () => {
    setShowUpload(false);
    if (course) {
      fetchDocuments(course.id);
    }
  };

  const handleNoteSave = () => {
    setShowNoteEditor(false);
    setSelectedNote(null);
    if (course) {
      fetchNotes(course.id);
    }
  };

  const handleNoteCancel = () => {
    setShowNoteEditor(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await deleteNote(noteId);
      if (error) throw error;
      if (course) {
        await fetchNotes(course.id);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };

  // Enhanced summarize document handler with interactive UI
  const handleSummarize = async (document: any) => {
    setSummarizingDocId(document.id);
    setSummaryData(prev => ({ ...prev, [document.id]: '' }));
    setSummaryErrors(prev => ({ ...prev, [document.id]: '' }));
    
    try {
      // First, get the signed URL for the document
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600);

      if (urlError) throw urlError;
      
      const documentUrl = urlData.signedUrl;
      
      // Call the AI backend summarization endpoint (now on port 4000)
      const response = await fetch('http://localhost:4000/api/summarize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentUrl }),
      });

      if (!response.ok) {
        throw new Error(`Failed to summarize document: ${response.statusText}`);
      }

      const data = await response.json();
      setSummaryData(prev => ({ 
        ...prev, 
        [document.id]: data.summary || 'No summary returned.' 
      }));
    } catch (error: any) {
      console.error('Summarization error:', error);
      setSummaryErrors(prev => ({ 
        ...prev, 
        [document.id]: error.message || 'Failed to summarize document. Please try again.' 
      }));
    } finally {
      setSummarizingDocId(null);
    }
  };

  const clearSummary = (docId: string) => {
    setSummaryData(prev => {
      const newData = { ...prev };
      delete newData[docId];
      return newData;
    });
    setSummaryErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[docId];
      return newErrors;
    });
  };

  if (!course) return null;

  const courseTasks = tasks.filter(task => task.course_id === id);

  return (
    <div className="space-y-6">
      {/* Course Header and Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen size={32} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800">{course.name}</h1>
              <p className="text-gray-500">{course.description}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Edit2 size={16} />}>
            Edit Course
          </Button>
        </div>

        <div className="mt-6 flex items-center">
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full h-full rounded-full border-8 border-blue-100" />
            <div
              className="w-full h-full rounded-full border-8 border-blue-500"
              style={{ clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)` }}
            />
          </div>
          <div className="ml-4">
            <p className="text-gray-600">
              You're {progress}% done with {course.name}.
            </p>
          </div>
        </div>
      </div>

      {/* Main grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Center side */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Documents</h2>
              <Button leftIcon={<Upload size={16} />} onClick={() => setShowUpload(true)}>
                Upload
              </Button>
            </CardHeader>
            <CardBody>
              {showUpload ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Upload Documents</h3>
                    <Button size="sm" variant="ghost" onClick={() => setShowUpload(false)}>
                      <X size={16} />
                    </Button>
                  </div>
                  <DocumentUpload courseId={course.id} onUploadComplete={handleUploadComplete} />
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      layout
                      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        summarizingDocId === doc.id 
                          ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg' 
                          : summaryData[doc.id] 
                          ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' 
                          : summaryErrors[doc.id]
                          ? 'border-red-300 bg-gradient-to-r from-red-50 to-pink-50'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {/* Animated background for active summarization */}
                      {summarizingDocId === doc.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20"
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                      )}

                      <div
                        className="relative flex items-start p-4 cursor-pointer"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`relative ${summarizingDocId === doc.id ? 'animate-pulse' : ''}`}>
                            <FileText size={24} className={
                              summarizingDocId === doc.id 
                                ? 'text-blue-600' 
                                : summaryData[doc.id] 
                                ? 'text-green-600' 
                                : summaryErrors[doc.id]
                                ? 'text-red-600'
                                : 'text-blue-600'
                            } />
                            {summarizingDocId === doc.id && (
                              <motion.div
                                className="absolute -inset-2 border-2 border-blue-400 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              />
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium flex items-center gap-2">
                              {doc.name}
                              {summarizingDocId === doc.id && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  <Sparkles size={16} className="text-blue-500" />
                                </motion.div>
                              )}
                              {summaryData[doc.id] && (
                                <CheckCircle size={16} className="text-green-500" />
                              )}
                              {summaryErrors[doc.id] && (
                                <AlertCircle size={16} className="text-red-500" />
                              )}
                            </h3>
                            
                            {/* Status indicator */}
                            {summarizingDocId === doc.id && (
                              <motion.p 
                                className="text-sm text-blue-600 font-medium mt-1"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                🤖 AI is analyzing this document...
                              </motion.p>
                            )}
                            
                            <div className="mt-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSummarize(doc);
                                }}
                                disabled={summarizingDocId === doc.id}
                                className={`${
                                  summarizingDocId === doc.id 
                                    ? 'border-blue-400 text-blue-600 bg-blue-50' 
                                    : summaryData[doc.id]
                                    ? 'border-green-400 text-green-600 bg-green-50'
                                    : ''
                                }`}
                                leftIcon={
                                  summarizingDocId === doc.id ? (
                                    <Loader2 className="animate-spin" size={14} />
                                  ) : summaryData[doc.id] ? (
                                    <CheckCircle size={14} />
                                  ) : (
                                    <Brain size={14} />
                                  )
                                }
                              >
                                {summarizingDocId === doc.id 
                                  ? 'Summarizing...' 
                                  : summaryData[doc.id] 
                                  ? 'Summarized ✓' 
                                  : 'Summarize'
                                }
                              </Button>
                              <Button size="sm" variant="outline">
                                Quiz
                              </Button>
                              <Button size="sm" variant="outline">
                                Flashcards
                              </Button>
                              <Button size="sm" variant="outline">
                                Ask AI
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary Display - Attached to specific document */}
                      <AnimatePresence>
                        {(summaryData[doc.id] || summaryErrors[doc.id]) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200"
                          >
                            <div className={`p-4 ${
                              summaryData[doc.id] 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50' 
                                : 'bg-gradient-to-r from-red-50 to-pink-50'
                            }`}>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  {summaryData[doc.id] ? (
                                    <>
                                      <Brain size={20} className="text-green-600" />
                                      <h3 className="font-semibold text-green-800">AI Summary for "{doc.name}"</h3>
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle size={20} className="text-red-600" />
                                      <h3 className="font-semibold text-red-800">Error Summarizing "{doc.name}"</h3>
                                    </>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => clearSummary(doc.id)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                              <div className={`leading-relaxed ${
                                summaryData[doc.id] ? 'text-gray-700' : 'text-red-700'
                              }`}>
                                {summaryData[doc.id] || summaryErrors[doc.id]}
                              </div>
                              {summaryData[doc.id] && (
                                <div className="mt-3 flex gap-2">
                                  <Button size="sm" variant="outline" className="text-green-600 border-green-300">
                                    Save Summary
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-green-600 border-green-300">
                                    Create Note
                                  </Button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-6">
                      <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">No documents yet</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowUpload(true)}>
                        Upload your first document
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {selectedDocument && (
                <div className="mt-4">
                  <DocumentViewer document={selectedDocument} />
                </div>
              )}
            </CardBody>
          </Card>

          {/* Notes Card */}
          <Card className="mt-6">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Notes</h2>
              <div className="flex gap-2">
                <Button variant="outline" leftIcon={<Brain size={16} />}>
                  AI Suggestions
                </Button>
                <Button leftIcon={<PlusCircle size={16} />} onClick={() => setShowNoteEditor(true)}>
                  New Note
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {showNoteEditor ? (
                <NoteEditor courseId={course.id} initialNote={selectedNote} onSave={handleNoteSave} onCancel={handleNoteCancel} />
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setSelectedNote(note);
                        setShowNoteEditor(true);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{note.title}</h3>
                        <span className="text-sm text-gray-500">{format(new Date(note.updated_at), 'MMM d, yyyy')}</span>
                      </div>
                      <p className="mt-2 text-gray-600 line-clamp-2">{note.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                    </div>
                  ))}

                  {notes.length === 0 && !showNoteEditor && (
                    <div className="text-center py-6">
                      <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">No notes yet</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowNoteEditor(true)}>
                        Create your first note
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right side (Study Progress + Tasks) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Study Progress</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Recent Quizzes</h3>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <span>Chapter 1 Quiz</span>
                      <span className="text-green-600">85%</span>
                    </div>
                    <Button size="sm" variant="outline" fullWidth>
                      Take New Quiz
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Flashcards</h3>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">20 cards due for review</p>
                    <Button size="sm" variant="outline" fullWidth>
                      Review Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tasks</h2>
            </CardHeader>
            <CardBody>
              <TaskManager courseId={course.id} initialTasks={courseTasks} onUpdate={fetchTasks} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CourseDashboard;