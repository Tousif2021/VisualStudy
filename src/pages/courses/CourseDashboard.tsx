import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, FileText, Brain, Edit2, Upload, PlusCircle, X, Loader2, Sparkles, CheckCircle, AlertCircle, Trash2, Eye, Target, Zap, Clock, Calendar, TrendingUp, ExternalLink, Download } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DocumentUpload } from '../../components/documents/DocumentUpload';
import { DocumentViewer } from '../../components/documents/DocumentViewer';
import NoteEditor from '../../components/notes/NoteEditor';
import { TaskManager } from '../../components/tasks/TaskManager';
import { useAppStore } from '../../lib/store';
import { deleteNote, deleteDocument, supabase } from '../../lib/supabase';

export function CourseDashboard() {
  const { id } = useParams<{ id: string }>();
  const { courses, fetchCourses, documents, fetchDocuments, notes, fetchNotes, tasks, fetchTasks } = useAppStore();
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState(75); // Changed to 75% for demo
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // Enhanced summarize states
  const [summarizingDocId, setSummarizingDocId] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{[key: string]: string}>({});
  const [summaryErrors, setSummaryErrors] = useState<{[key: string]: string}>({});
  
  // Document viewer states
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [documentUrls, setDocumentUrls] = useState<{[key: string]: string}>({});
  
  // Delete states
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  // Mock course data for progress display
  const courseStats = {
    totalChapters: 12,
    completedChapters: 9,
    timeSpent: '24h 30m',
    nextMilestone: 'Chapter 10: Advanced Topics',
    estimatedCompletion: '3 days'
  };

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

  // Handle document viewing
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
const handleEditCourse = async (courseId: string, name: string, description: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ name, description })
        .eq('id', courseId);

      if (error) throw error;
      
      await fetchCourses();
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    }
  };
  // Handle document deletion
  const handleDeleteDocument = async (document: any) => {
    if (!window.confirm(`Are you sure you want to delete "${document.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingDocId(document.id);
    
    try {
      const { error } = await deleteDocument(document.id);
      if (error) throw error;
      
      // Clear any summary data for this document
      clearSummary(document.id);
      clearDocumentView(document.id);
      
      // Refresh documents list
      if (course) {
        await fetchDocuments(course.id);
      }
    } catch (error: any) {
      console.error('Failed to delete document:', error);
      alert(`Failed to delete document: ${error.message}`);
    } finally {
      setDeletingDocId(null);
    }
  };

  if (!course) return null;

  const courseTasks = tasks.filter(task => task.course_id === id);

  return (
    <div className="space-y-8">
      {/* Modern Course Header with Horizontal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-2xl shadow-lg border border-blue-100/50 p-8 overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-cyan-400/10 rounded-full blur-xl" />
        
        <div className="relative">
          {/* Course Info */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <BookOpen size={40} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {course.name}
                </h1>
                <p className="text-gray-600 text-lg mb-4">{course.description}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{courseStats.timeSpent} spent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{courseStats.estimatedCompletion} to complete</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" leftIcon={<Edit2 size={16} />} className="border-blue-200 text-blue-600 hover:bg-blue-50">
              Edit Course
              setEditingCourse(course)
            </Button>
          </div>

          {/* Modern Horizontal Progress Bar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Course Progress</h3>
                <p className="text-sm text-gray-600">
                  {courseStats.completedChapters} of {courseStats.totalChapters} chapters completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {progress}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full shadow-lg relative overflow-hidden"
                >
                  {/* Animated shine effect */}
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                </motion.div>
              </div>
              
              {/* Progress milestones */}
              <div className="absolute -top-2 left-0 w-full flex justify-between">
                {[25, 50, 75, 100].map((milestone) => (
                  <motion.div
                    key={milestone}
                    initial={{ scale: 0 }}
                    animate={{ scale: progress >= milestone ? 1.2 : 1 }}
                    className={`w-2 h-2 rounded-full ${
                      progress >= milestone 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg' 
                        : 'bg-gray-300'
                    }`}
                    style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
                  />
                ))}
              </div>
            </div>

            {/* Next Milestone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Target size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Next Milestone</h4>
                  <p className="text-sm text-gray-600">{courseStats.nextMilestone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">25% remaining</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

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
                          : viewingDocId === doc.id
                          ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
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

                      <div className="relative flex items-start p-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`relative ${summarizingDocId === doc.id ? 'animate-pulse' : ''}`}>
                            <FileText size={24} className={
                              summarizingDocId === doc.id 
                                ? 'text-blue-600' 
                                : viewingDocId === doc.id
                                ? 'text-green-600'
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
                            <h3 className="font-medium flex items-center gap-2 mb-3">
                              {doc.name}
                              {summarizingDocId === doc.id && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  <Sparkles size={16} className="text-blue-500" />
                                </motion.div>
                              )}
                              {viewingDocId === doc.id && (
                                <Eye size={16} className="text-green-500" />
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
                                className="text-sm text-blue-600 font-medium mb-3"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                🤖 AI is analyzing this document...
                              </motion.p>
                            )}
                            
                            {/* Reorganized Action Buttons */}
                            <div className="flex gap-2 flex-wrap">
                              {/* Primary Action - View Document */}
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDocument(doc);
                                }}
                                className={`transition-all duration-200 ${
                                  viewingDocId === doc.id
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
                                }`}
                                leftIcon={<Eye size={14} />}
                              >
                                {viewingDocId === doc.id ? 'Hide Document' : 'View Document'}
                              </Button>

                              {/* Secondary Actions */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSummarize(doc);
                                }}
                                disabled={summarizingDocId === doc.id}
                                className={`border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-200 ${
                                  summarizingDocId === doc.id 
                                    ? 'border-blue-400 bg-blue-50' 
                                    : summaryData[doc.id]
                                    ? 'border-green-400 text-green-600 bg-green-50 hover:bg-green-100'
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

                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-purple-300 text-purple-600 hover:bg-purple-50 transition-all duration-200"
                                leftIcon={<Target size={14} />}
                              >
                                Quiz
                              </Button>

                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-amber-300 text-amber-600 hover:bg-amber-50 transition-all duration-200"
                                leftIcon={<Zap size={14} />}
                              >
                                Flashcards
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(doc);
                            }}
                            disabled={deletingDocId === doc.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-70 hover:opacity-100 transition-all"
                            leftIcon={
                              deletingDocId === doc.id ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <Trash2 size={14} />
                              )
                            }
                          >
                            {deletingDocId === doc.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>

                      {/* Document Viewer Display - Inline like Summary */}
                      <AnimatePresence>
                        {viewingDocId === doc.id && documentUrls[doc.id] && (
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
                                  <h3 className="font-semibold text-green-800">Document Viewer - "{doc.name}"</h3>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => clearDocumentView(doc.id)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                              
                              {/* Enhanced Document Viewer */}
                              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                {doc.file_type === 'pdf' ? (
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
                                          onClick={() => window.open(documentUrls[doc.id], '_blank')}
                                          leftIcon={<ExternalLink size={14} />}
                                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                        >
                                          Open in New Tab
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = documentUrls[doc.id];
                                            link.download = doc.name;
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
                                      <p className="text-sm text-gray-500 mb-4">
                                        Click "Open in New Tab" to view the document or "Download" to save it locally.
                                      </p>
                                      <div className="flex justify-center gap-3">
                                        <Button
                                          onClick={() => window.open(documentUrls[doc.id], '_blank')}
                                          leftIcon={<ExternalLink size={16} />}
                                          className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                          Open in New Tab
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = documentUrls[doc.id];
                                            link.download = doc.name;
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
                                        onClick={() => window.open(documentUrls[doc.id], '_blank')}
                                        leftIcon={<ExternalLink size={16} />}
                                      >
                                        Open in New Tab
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          const link = document.createElement('a');
                                          link.href = documentUrls[doc.id];
                                          link.download = doc.name;
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
                      </AnimatePresence>

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
                                  <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                                    Save Summary
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
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