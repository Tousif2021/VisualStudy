import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  FileText, 
  Plus, 
  Edit2,
  Trash2,
  Eye,
  Brain,
  Target,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/cButton';
import { Input } from '../ui/CInput';
import { Textarea } from '../ui/Textarea';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { useAppStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';

interface Chapter {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  topics: Topic[];
}

interface Topic {
  id: string;
  title: string;
  completed: boolean;
}

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  chapter_id?: string;
  topic_id?: string;
  tags?: string[];
  created_at: string;
  accessed?: boolean;
  summarized?: boolean;
  quizzed?: boolean;
  flashcarded?: boolean;
}

interface CourseSyllabusProps {
  courseId: string;
  documents: Document[];
  summarizedDocs: string[];
  quizzedDocs: string[];
  flashcardedDocs: string[];
  onAddChapter?: () => void;
  onAddTopic?: (chapterId: string) => void;
}

export const CourseSyllabus: React.FC<CourseSyllabusProps> = ({
  courseId,
  documents,
  summarizedDocs,
  quizzedDocs,
  flashcardedDocs,
  onAddChapter,
  onAddTopic
}) => {
  const { courses } = useAppStore();
  const [syllabus, setSyllabus] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingTopic, setEditingTopic] = useState<{topic: Topic, chapterId: string} | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterDescription, setNewChapterDescription] = useState('');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [addingChapter, setAddingChapter] = useState(false);
  const [addingTopic, setAddingTopic] = useState<string | null>(null);
  const [savingChanges, setSavingChanges] = useState(false);

  useEffect(() => {
    loadSyllabus();
  }, [courseId]);

  const loadSyllabus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const course = courses.find(c => c.id === courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      if (course.syllabus && course.syllabus.chapters) {
        setSyllabus(course.syllabus.chapters);
      } else {
        // Create default syllabus with one chapter
        const defaultSyllabus = [
          {
            id: crypto.randomUUID(),
            title: 'Chapter 1: Introduction',
            description: 'Getting started with the course material',
            completed: false,
            topics: [
              {
                id: crypto.randomUUID(),
                title: 'Overview',
                completed: false
              }
            ]
          }
        ];
        
        setSyllabus(defaultSyllabus);
        
        // Save default syllabus to database
        await saveSyllabus(defaultSyllabus);
      }
    } catch (err) {
      console.error('Error loading syllabus:', err);
      setError('Failed to load syllabus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveSyllabus = async (updatedSyllabus: Chapter[]) => {
    try {
      setSavingChanges(true);
      
      const { error } = await supabase
        .from('courses')
        .update({ 
          syllabus: { chapters: updatedSyllabus } 
        })
        .eq('id', courseId);
      
      if (error) throw error;
      
    } catch (err) {
      console.error('Error saving syllabus:', err);
      setError('Failed to save syllabus changes. Please try again.');
    } finally {
      setSavingChanges(false);
    }
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const handleAddChapter = async () => {
    if (!newChapterTitle.trim()) return;
    
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: newChapterTitle.trim(),
      description: newChapterDescription.trim(),
      completed: false,
      topics: []
    };
    
    const updatedSyllabus = [...syllabus, newChapter];
    setSyllabus(updatedSyllabus);
    await saveSyllabus(updatedSyllabus);
    
    setAddingChapter(false);
    setNewChapterTitle('');
    setNewChapterDescription('');
    
    // Expand the new chapter
    setExpandedChapters(prev => {
      const next = new Set(prev);
      next.add(newChapter.id);
      return next;
    });
  };

  const handleAddTopic = async (chapterId: string) => {
    if (!newTopicTitle.trim()) return;
    
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      title: newTopicTitle.trim(),
      completed: false
    };
    
    const updatedSyllabus = syllabus.map(chapter => 
      chapter.id === chapterId
        ? { ...chapter, topics: [...chapter.topics, newTopic] }
        : chapter
    );
    
    setSyllabus(updatedSyllabus);
    await saveSyllabus(updatedSyllabus);
    
    setAddingTopic(null);
    setNewTopicTitle('');
  };

  const handleEditChapter = async () => {
    if (!editingChapter || !editingChapter.title.trim()) return;
    
    const updatedSyllabus = syllabus.map(chapter => 
      chapter.id === editingChapter.id
        ? { ...editingChapter }
        : chapter
    );
    
    setSyllabus(updatedSyllabus);
    await saveSyllabus(updatedSyllabus);
    
    setEditingChapter(null);
  };

  const handleEditTopic = async () => {
    if (!editingTopic || !editingTopic.topic.title.trim()) return;
    
    const updatedSyllabus = syllabus.map(chapter => 
      chapter.id === editingTopic.chapterId
        ? { 
            ...chapter, 
            topics: chapter.topics.map(topic => 
              topic.id === editingTopic.topic.id
                ? { ...editingTopic.topic }
                : topic
            ) 
          }
        : chapter
    );
    
    setSyllabus(updatedSyllabus);
    await saveSyllabus(updatedSyllabus);
    
    setEditingTopic(null);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!window.confirm('Are you sure you want to delete this chapter? This will not delete any associated documents.')) {
      return;
    }
    
    const updatedSyllabus = syllabus.filter(chapter => chapter.id !== chapterId);
    setSyllabus(updatedSyllabus);
    await saveSyllabus(updatedSyllabus);
  };

  const handleDeleteTopic = async (chapterId: string, topicId: string) => {
    if (!window.confirm('Are you sure you want to delete this topic? This will not delete any associated documents.')) {
      return;
    }
    
    const updatedSyllabus = syllabus.map(chapter => 
      chapter.id === chapterId
        ? { ...chapter, topics: chapter.topics.filter(topic => topic.id !== topicId) }
        : chapter
    );
    
    setSyllabus(updatedSyllabus);
    await saveSyllabus(updatedSyllabus);
  };

  const toggleChapterCompletion = async (chapterId: string, completed: boolean) => {
    const updatedSyllabus = syllabus.map(chapter => 
      chapter.id === chapterId
        ? { ...chapter, completed }
        : chapter
    );
    
    setSyllabus(updatedSyllabus);
    await saveSyllabus(updatedSyllabus);
  };

  const toggleTopicCompletion = async (chapterId: string, topicId: string, completed: boolean) => {
    const updatedSyllabus = syllabus.map(chapter => 
      chapter.id === chapterId
        ? { 
            ...chapter, 
            topics: chapter.topics.map(topic => 
              topic.id === topicId
                ? { ...topic, completed }
                : topic
            ) 
          }
        : chapter
    );
    
    setSyllabus(updatedSyllabus);
    await saveSyllabus(updatedSyllabus);
  };

  // Get documents for a specific chapter or topic
  const getDocumentsForChapter = (chapterId: string) => {
    return documents.filter(doc => doc.chapter_id === chapterId);
  };

  const getDocumentsForTopic = (topicId: string) => {
    return documents.filter(doc => doc.topic_id === topicId);
  };

  // Calculate progress
  const calculateProgress = () => {
    let totalTopics = 0;
    let completedTopics = 0;
    
    syllabus.forEach(chapter => {
      totalTopics += chapter.topics.length;
      completedTopics += chapter.topics.filter(topic => topic.completed).length;
    });
    
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };

  const progress = calculateProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full"
        />
        <span className="ml-3 text-blue-700 font-medium">Loading syllabus...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
        <p className="font-medium mb-2">Error loading syllabus</p>
        <p className="text-sm">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadSyllabus} 
          className="mt-2 border-red-300 text-red-600 hover:bg-red-50"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-white border-blue-100">
      <CardHeader className="flex justify-between items-center border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Course Syllabus</h2>
            <p className="text-sm text-gray-600">
              {syllabus.length} {syllabus.length === 1 ? 'chapter' : 'chapters'} • {progress}% complete
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={<Edit2 size={14} />}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            {isEditing ? 'Done Editing' : 'Edit Syllabus'}
          </Button>
          {isEditing && (
            <Button
              size="sm"
              onClick={() => setAddingChapter(true)}
              leftIcon={<Plus size={14} />}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Add Chapter
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardBody className="p-0">
        {/* Progress Bar */}
        <div className="p-4 border-b border-blue-100 bg-blue-50/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-700">Course Progress</span>
            <span className="text-sm font-medium text-blue-700">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Syllabus Content */}
        <div className="divide-y divide-blue-100">
          {syllabus.map((chapter) => (
            <div key={chapter.id} className="border-b border-blue-100 last:border-b-0">
              {/* Chapter Header */}
              <div 
                className={`flex items-start p-4 cursor-pointer hover:bg-blue-50/50 transition-colors ${
                  expandedChapters.has(chapter.id) ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {expandedChapters.has(chapter.id) ? (
                      <ChevronDown size={18} className="text-blue-600" />
                    ) : (
                      <ChevronRight size={18} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                      {chapter.completed && (
                        <CheckCircle size={16} className="text-green-600" />
                      )}
                    </div>
                    {chapter.description && (
                      <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="flex items-center gap-2 ml-4" onClick={e => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingChapter(chapter);
                        setNewChapterTitle(chapter.title);
                        setNewChapterDescription(chapter.description);
                      }}
                      className="text-blue-600 hover:bg-blue-100"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChapterCompletion(chapter.id, !chapter.completed);
                      }}
                      className={`border-blue-200 ${
                        chapter.completed 
                          ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      leftIcon={chapter.completed ? <CheckCircle size={14} /> : <Clock size={14} />}
                    >
                      {chapter.completed ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Chapter Content (Topics and Documents) */}
              <AnimatePresence>
                {expandedChapters.has(chapter.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pl-10 pr-4 pb-4 bg-blue-50/20"
                  >
                    {/* Chapter Documents */}
                    {getDocumentsForChapter(chapter.id).length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FileText size={14} className="text-blue-600" />
                          Chapter Documents
                        </h4>
                        <div className="space-y-2">
                          {getDocumentsForChapter(chapter.id).map((doc) => (
                            <div 
                              key={doc.id} 
                              className={`p-3 rounded-lg border ${
                                summarizedDocs.includes(doc.id) || quizzedDocs.includes(doc.id) || flashcardedDocs.includes(doc.id)
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText size={16} className={
                                    summarizedDocs.includes(doc.id) || quizzedDocs.includes(doc.id) || flashcardedDocs.includes(doc.id)
                                      ? 'text-green-600'
                                      : 'text-blue-600'
                                  } />
                                  <span className="text-sm font-medium">{doc.name}</span>
                                </div>
                                <div className="flex gap-1">
                                  {summarizedDocs.includes(doc.id) && (
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center" title="Summarized">
                                      <Brain size={12} className="text-green-600" />
                                    </div>
                                  )}
                                  {quizzedDocs.includes(doc.id) && (
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center" title="Quiz Generated">
                                      <Target size={12} className="text-green-600" />
                                    </div>
                                  )}
                                  {flashcardedDocs.includes(doc.id) && (
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center" title="Flashcards Created">
                                      <Zap size={12} className="text-green-600" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Topics */}
                    <div className="space-y-3">
                      {chapter.topics.map((topic) => (
                        <div key={topic.id} className="bg-white rounded-lg border border-blue-100 p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {topic.completed ? (
                                <CheckCircle size={16} className="text-green-600" />
                              ) : (
                                <Clock size={16} className="text-blue-600" />
                              )}
                              <span className="font-medium text-gray-800">{topic.title}</span>
                            </div>
                            
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingTopic({
                                      topic,
                                      chapterId: chapter.id
                                    });
                                    setNewTopicTitle(topic.title);
                                  }}
                                  className="text-blue-600 hover:bg-blue-100 h-7 w-7 p-0"
                                >
                                  <Edit2 size={14} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteTopic(chapter.id, topic.id)}
                                  className="text-red-600 hover:bg-red-100 h-7 w-7 p-0"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleTopicCompletion(chapter.id, topic.id, !topic.completed)}
                                className={`text-xs py-1 px-2 ${
                                  topic.completed 
                                    ? 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200' 
                                    : 'text-blue-600 hover:bg-blue-50 border-blue-200'
                                }`}
                              >
                                {topic.completed ? 'Completed' : 'Mark Complete'}
                              </Button>
                            )}
                          </div>

                          {/* Topic Documents */}
                          {getDocumentsForTopic(topic.id).length > 0 && (
                            <div className="mt-3 pl-6">
                              <div className="text-xs text-gray-500 mb-2">Documents:</div>
                              <div className="space-y-2">
                                {getDocumentsForTopic(topic.id).map((doc) => (
                                  <div 
                                    key={doc.id} 
                                    className={`p-2 rounded-lg border text-xs ${
                                      summarizedDocs.includes(doc.id) || quizzedDocs.includes(doc.id) || flashcardedDocs.includes(doc.id)
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-white border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <FileText size={12} className={
                                          summarizedDocs.includes(doc.id) || quizzedDocs.includes(doc.id) || flashcardedDocs.includes(doc.id)
                                            ? 'text-green-600'
                                            : 'text-blue-600'
                                        } />
                                        <span className="font-medium">{doc.name}</span>
                                      </div>
                                      <div className="flex gap-1">
                                        {summarizedDocs.includes(doc.id) && (
                                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center" title="Summarized">
                                            <Brain size={10} className="text-green-600" />
                                          </div>
                                        )}
                                        {quizzedDocs.includes(doc.id) && (
                                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center" title="Quiz Generated">
                                            <Target size={10} className="text-green-600" />
                                          </div>
                                        )}
                                        {flashcardedDocs.includes(doc.id) && (
                                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center" title="Flashcards Created">
                                            <Zap size={10} className="text-green-600" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Topic Button */}
                      {isEditing && (
                        <div>
                          {addingTopic === chapter.id ? (
                            <div className="bg-white rounded-lg border border-blue-200 p-3">
                              <Input
                                value={newTopicTitle}
                                onChange={(e) => setNewTopicTitle(e.target.value)}
                                placeholder="Enter topic title"
                                fullWidth
                                className="mb-3"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setAddingTopic(null);
                                    setNewTopicTitle('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddTopic(chapter.id)}
                                  disabled={!newTopicTitle.trim()}
                                >
                                  Add Topic
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setAddingTopic(chapter.id)}
                              leftIcon={<Plus size={14} />}
                              className="w-full border-dashed border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              Add Topic
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Add Chapter Form */}
          {isEditing && addingChapter && (
            <div className="p-4 border-b border-blue-100 bg-blue-50/30">
              <h3 className="font-medium text-blue-800 mb-3">Add New Chapter</h3>
              <div className="space-y-3">
                <Input
                  label="Chapter Title"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="e.g., Chapter 1: Introduction"
                  fullWidth
                />
                <Textarea
                  label="Description (optional)"
                  value={newChapterDescription}
                  onChange={(e) => setNewChapterDescription(e.target.value)}
                  placeholder="Brief description of this chapter"
                  rows={3}
                  fullWidth
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAddingChapter(false);
                      setNewChapterTitle('');
                      setNewChapterDescription('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddChapter}
                    disabled={!newChapterTitle.trim() || savingChanges}
                    isLoading={savingChanges}
                  >
                    Add Chapter
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {syllabus.length === 0 && !addingChapter && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No syllabus yet</h3>
              <p className="text-gray-600 mb-4">Create your course structure to organize your learning journey</p>
              <Button
                onClick={() => setAddingChapter(true)}
                leftIcon={<Plus size={16} />}
              >
                Add First Chapter
              </Button>
            </div>
          )}
        </div>
      </CardBody>

      {/* Edit Chapter Modal */}
      <AnimatePresence>
        {editingChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setEditingChapter(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Chapter</h3>
              <div className="space-y-4">
                <Input
                  label="Chapter Title"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="Chapter title"
                  fullWidth
                />
                <Textarea
                  label="Description"
                  value={newChapterDescription}
                  onChange={(e) => setNewChapterDescription(e.target.value)}
                  placeholder="Chapter description"
                  rows={3}
                  fullWidth
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingChapter(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (editingChapter) {
                        const updatedChapter = {
                          ...editingChapter,
                          title: newChapterTitle.trim(),
                          description: newChapterDescription.trim()
                        };
                        setEditingChapter(updatedChapter);
                        handleEditChapter();
                      }
                    }}
                    disabled={!newChapterTitle.trim() || savingChanges}
                    isLoading={savingChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Topic Modal */}
      <AnimatePresence>
        {editingTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setEditingTopic(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Topic</h3>
              <div className="space-y-4">
                <Input
                  label="Topic Title"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="Topic title"
                  fullWidth
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingTopic(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (editingTopic) {
                        const updatedTopic = {
                          ...editingTopic.topic,
                          title: newTopicTitle.trim()
                        };
                        setEditingTopic({
                          topic: updatedTopic,
                          chapterId: editingTopic.chapterId
                        });
                        handleEditTopic();
                      }
                    }}
                    disabled={!newTopicTitle.trim() || savingChanges}
                    isLoading={savingChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};