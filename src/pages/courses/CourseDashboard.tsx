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
import { NoteEditor } from '../../components/notes/NoteEditor';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { TaskManager } from '../../components/tasks/TaskManager';
import { useAppStore } from '../../lib/store';

export function CourseDashboard() {
  const { id } = useParams<{ id: string }>();
  const { courses, fetchCourses, documents, fetchDocuments, notes, fetchNotes, tasks, fetchTasks } = useAppStore();
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState(100);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  
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
                          <Button size="sm" variant="outline">Summarize</Button>
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
            </CardBody>
          </Card>

          <Card className="mt-6">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Notes</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  leftIcon={<Brain size={16} />}
                >
                  AI Suggestions
                </Button>
                <Button
                  leftIcon={<PlusCircle size={16} />}
                  onClick={() => setShowNoteEditor(true)}
                >
                  New Note
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {showNoteEditor ? (
                <NoteEditor
                  courseId={course.id}
                  initialNote={selectedNote}
                  onSave={handleNoteSave}
                  onCancel={() => {
                    setShowNoteEditor(false);
                    setSelectedNote(null);
                  }}
                />
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
                        <span className="text-sm text-gray-500">
                          {format(new Date(note.updated_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 line-clamp-2">
                        {note.content}
                      </p>
                    </div>
                  ))}

                  {notes.length === 0 && !showNoteEditor && (
                    <div className="text-center py-6">
                      <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">No notes yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setShowNoteEditor(true)}
                      >
                        Create your first note
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

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
              <TaskManager
                courseId={course.id}
                initialTasks={courseTasks}
                onUpdate={fetchTasks}
              />
            </CardBody>
          </Card>
              <ChatInterface />
        </div>
      </div>
    </div>
  );
}

export default CourseDashboard;