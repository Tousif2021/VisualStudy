import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Brain,
  Edit2,
  Upload,
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  ChevronRight,
  BarChart2,
  MessageCircle,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DocumentUpload } from '../../components/documents/DocumentUpload';
import { DocumentViewer } from '../../components/documents/DocumentViewer';
import NoteEditor from '../../components/notes/NoteEditor';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { TaskManager } from '../../components/tasks/TaskManager';
import { useAppStore } from '../../lib/store';
import { deleteNote } from '../../lib/supabase';

export function CourseDashboard() {
  const { id } = useParams<{ id: string }>();
  const { courses, fetchCourses, documents, fetchDocuments, notes, fetchNotes, tasks, fetchTasks } = useAppStore();
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState(100);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // --- SUMMARIZE states
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

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

  // --- Summarize handler
  const handleSummarize = async (docUrl: string) => {
    setIsSummarizing(true);
    setSummary(null);
    setSummaryError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl: docUrl }),
      });
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
      const data = await response.json();
      setSummary(data.summary || 'No summary returned');
    } catch (err: any) {
      console.error('Summarize error:', err);
      setSummaryError('Failed to generate summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!course) return null;

  const courseTasks = tasks.filter(task => task.course_id === id);

  return (
    <div className="space-y-6">
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
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 size={16} />}
          >
            Edit Course
          </Button>
        </div>

        <div className="mt-6 flex items-center">
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full h-full rounded-full border-8 border-blue-100">
              <div 
                className="w-full h-full rounded-full border-8 border-blue-500"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`
                }}
              />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-gray-600">
              You're {progress}% done with {course.name}.
            </p>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Documents</h2>
              <Button 
                leftIcon={<Upload size={16} />}
                onClick={() => setShowUpload(true)}
              >
                Upload
              </Button>
            </CardHeader>
            <CardBody>
              {showUpload ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Upload Documents</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowUpload(false)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <DocumentUpload
                    courseId={course.id}
                    onUploadComplete={handleUploadComplete}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <FileText size={24} className="text-blue-600" />
                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium">{doc.name}</h3>
                        <div className="mt-2 flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSummarize(doc.url); // Assuming doc.url is document URL
                            }}
                            disabled={isSummarizing}
                          >
                            {isSummarizing ? 'Summarizing...' : 'Summarize'}
                          </Button>
                          <Button size="sm" variant="outline">Quiz</Button>
                          <Button size="sm" variant="outline">Flashcards</Button>
                          <Button size="sm" variant="outline">Ask AI</Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {documents.length === 0 && (
                    <div className="text-center py-6">
                      <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">No documents yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setShowUpload(true)}
                      >
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

              {/* Summary output */}
              {summary && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md text-gray-700">
                  <h3 className="font-semibold mb-2">Summary:</h3>
                  <p>{summary}</p>
                </div>
              )}
              {summaryError && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded-md text-red-700">
                  <p>{summaryError}</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Notes, Study Progress, Tasks sections unchanged, so omitted here to keep it short */}

        </div>

        {/* Right side cards (Study Progress, Tasks) remain unchanged */}
        <div className="space-y-6">
          {/* ... your existing cards ... */}
        </div>
      </div>
    </div>
  );
}

export default CourseDashboard;
