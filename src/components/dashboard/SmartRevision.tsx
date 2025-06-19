import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingDown, 
  AlertTriangle, 
  Plus, 
  CheckCircle, 
  BookOpen, 
  Target, 
  Clock,
  Zap,
  Star,
  ArrowRight,
  X,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/cButton';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { useAppStore } from '../../lib/store';
import { createTask } from '../../lib/supabase';

interface PerformanceData {
  courseId: string;
  courseName: string;
  averageScore: number;
  weakAreas: string[];
  lastActivity: string;
  totalQuizzes: number;
  completedQuizzes: number;
  flashcardsReviewed: number;
  totalFlashcards: number;
  recommendedActions: RecommendedAction[];
}

interface RecommendedAction {
  id: string;
  type: 'quiz' | 'flashcard' | 'review' | 'practice';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  courseId: string;
  courseName: string;
  chapter?: string;
  isAddedToTodo: boolean;
}

export const SmartRevision: React.FC = () => {
  const { user, courses, tasks, fetchTasks } = useAppStore();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToTodo, setAddingToTodo] = useState<string | null>(null);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);

  // Simulate performance analysis
  useEffect(() => {
    const analyzePerformance = () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const mockPerformanceData: PerformanceData[] = courses.map(course => {
          const averageScore = Math.floor(Math.random() * 100);
          const isStruggling = averageScore < 50;
          
          const weakAreas = isStruggling 
            ? ['Chapter 3: Advanced Concepts', 'Chapter 5: Problem Solving', 'Chapter 7: Applications']
            : averageScore < 70 
            ? ['Chapter 5: Problem Solving']
            : [];

          const recommendedActions: RecommendedAction[] = [];
          
          if (isStruggling) {
            recommendedActions.push(
              {
                id: `${course.id}-review-1`,
                type: 'review',
                title: `Review ${course.name} - Chapter 3`,
                description: 'Your performance in Chapter 3 is below 50%. Focus on fundamental concepts.',
                priority: 'high',
                estimatedTime: '45 min',
                courseId: course.id,
                courseName: course.name,
                chapter: 'Chapter 3',
                isAddedToTodo: false
              },
              {
                id: `${course.id}-quiz-1`,
                type: 'quiz',
                title: `Practice Quiz: ${course.name} Basics`,
                description: 'Take a focused quiz on fundamental concepts to identify specific gaps.',
                priority: 'high',
                estimatedTime: '20 min',
                courseId: course.id,
                courseName: course.name,
                isAddedToTodo: false
              },
              {
                id: `${course.id}-flashcard-1`,
                type: 'flashcard',
                title: `Flashcard Review: Key Terms`,
                description: 'Review essential terminology and definitions for better understanding.',
                priority: 'medium',
                estimatedTime: '15 min',
                courseId: course.id,
                courseName: course.name,
                isAddedToTodo: false
              }
            );
          } else if (averageScore < 70) {
            recommendedActions.push(
              {
                id: `${course.id}-practice-1`,
                type: 'practice',
                title: `Practice Problems: ${course.name}`,
                description: 'Work on practice problems to strengthen your understanding.',
                priority: 'medium',
                estimatedTime: '30 min',
                courseId: course.id,
                courseName: course.name,
                isAddedToTodo: false
              }
            );
          }

          return {
            courseId: course.id,
            courseName: course.name,
            averageScore,
            weakAreas,
            lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            totalQuizzes: Math.floor(Math.random() * 10) + 5,
            completedQuizzes: Math.floor(Math.random() * 8) + 2,
            flashcardsReviewed: Math.floor(Math.random() * 50) + 20,
            totalFlashcards: Math.floor(Math.random() * 80) + 40,
            recommendedActions
          };
        });

        const allRecommendations = mockPerformanceData.flatMap(data => data.recommendedActions);
        
        setPerformanceData(mockPerformanceData);
        setRecommendations(allRecommendations);
        setIsLoading(false);
      }, 1500);
    };

    if (courses.length > 0) {
      analyzePerformance();
    }
  }, [courses]);

  const handleAddToTodo = async (recommendation: RecommendedAction) => {
    if (!user) return;
    
    setAddingToTodo(recommendation.id);
    
    try {
      // Calculate due date (24 hours from now for high priority, 48 hours for medium/low)
      const dueDate = new Date();
      dueDate.setHours(dueDate.getHours() + (recommendation.priority === 'high' ? 24 : 48));
      
      const { error } = await createTask(
        user.id,
        recommendation.title,
        recommendation.description,
        dueDate.toISOString(),
        recommendation.priority,
        recommendation.courseId
      );

      if (error) throw error;

      // Update local state
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendation.id 
            ? { ...rec, isAddedToTodo: true }
            : rec
        )
      );

      // Refresh tasks
      await fetchTasks();
      
    } catch (error) {
      console.error('Failed to add to todo:', error);
    } finally {
      setAddingToTodo(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <Target className="w-5 h-5" />;
      case 'flashcard': return <Star className="w-5 h-5" />;
      case 'review': return <BookOpen className="w-5 h-5" />;
      case 'practice': return <Zap className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const strugglingCourses = performanceData.filter(data => data.averageScore < 50);
  const needsAttentionCourses = performanceData.filter(data => data.averageScore >= 50 && data.averageScore < 70);
  const highPriorityRecommendations = recommendations.filter(rec => rec.priority === 'high' && !rec.isAddedToTodo);

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardBody className="p-6">
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full"
            />
            <span className="ml-3 text-purple-700 font-medium">Analyzing your performance...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white border-0 shadow-xl">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Smart Revision Assistant</h2>
                <p className="text-purple-100">AI-powered study recommendations based on your performance</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-100">Last Analysis</div>
              <div className="font-semibold">Just now</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700">{strugglingCourses.length}</div>
                <div className="text-sm text-red-600">Needs Immediate Attention</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <TrendingDown size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-700">{needsAttentionCourses.length}</div>
                <div className="text-sm text-yellow-600">Needs Some Work</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Target size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">{highPriorityRecommendations.length}</div>
                <div className="text-sm text-blue-600">High Priority Actions</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Struggling Courses Alert */}
      {strugglingCourses.length > 0 && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-2">Courses Needing Immediate Attention</h3>
                <div className="space-y-3">
                  {strugglingCourses.map(course => (
                    <div key={course.courseId} className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-red-700">{course.courseName}</h4>
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                          {course.averageScore}% avg
                        </span>
                      </div>
                      <div className="text-sm text-red-600 mb-3">
                        Weak areas: {course.weakAreas.join(', ')}
                      </div>
                      <div className="flex gap-2">
                        {course.recommendedActions.slice(0, 2).map(action => (
                          <Button
                            key={action.id}
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            leftIcon={getTypeIcon(action.type)}
                            onClick={() => handleAddToTodo(action)}
                            disabled={action.isAddedToTodo || addingToTodo === action.id}
                          >
                            {action.isAddedToTodo ? 'Added ✓' : addingToTodo === action.id ? 'Adding...' : 'Add to Todo'}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Smart Recommendations */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Smart Recommendations</h3>
              <p className="text-gray-600 text-sm">Personalized study actions based on your performance</p>
            </div>
          </div>
          {recommendations.length > 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllRecommendations(!showAllRecommendations)}
            >
              {showAllRecommendations ? 'Show Less' : `View All (${recommendations.length})`}
            </Button>
          )}
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <AnimatePresence>
              {(showAllRecommendations ? recommendations : recommendations.slice(0, 3)).map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPriorityColor(recommendation.priority)} flex items-center justify-center text-white`}>
                        {getTypeIcon(recommendation.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            recommendation.priority === 'high' ? 'bg-red-100 text-red-700' :
                            recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {recommendation.priority} priority
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{recommendation.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {recommendation.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen size={12} />
                            {recommendation.courseName}
                          </div>
                          {recommendation.chapter && (
                            <div className="flex items-center gap-1">
                              <BarChart3 size={12} />
                              {recommendation.chapter}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {recommendation.isAddedToTodo ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">Added to Todo</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          leftIcon={<Plus size={16} />}
                          onClick={() => handleAddToTodo(recommendation)}
                          disabled={addingToTodo === recommendation.id}
                          isLoading={addingToTodo === recommendation.id}
                        >
                          Add to Todo
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {recommendations.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Great job! 🎉</h3>
                <p className="text-gray-600">You're performing well across all courses. Keep up the excellent work!</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Performance Details */}
      {performanceData.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Course Performance Details</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {performanceData.map(course => (
                <div key={course.courseId} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{course.courseName}</h4>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.averageScore >= 70 ? 'bg-green-100 text-green-700' :
                        course.averageScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {course.averageScore}% average
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Quizzes</div>
                      <div className="font-medium">{course.completedQuizzes}/{course.totalQuizzes}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Flashcards</div>
                      <div className="font-medium">{course.flashcardsReviewed}/{course.totalFlashcards}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Last Activity</div>
                      <div className="font-medium">{new Date(course.lastActivity).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Recommendations</div>
                      <div className="font-medium">{course.recommendedActions.length} actions</div>
                    </div>
                  </div>
                  {course.weakAreas.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">Areas needing attention:</div>
                      <div className="flex flex-wrap gap-2">
                        {course.weakAreas.map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};