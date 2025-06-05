import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../lib/store';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, courses, tasks, notes, fetchCourses, fetchTasks, fetchNotes } = useAppStore();
  const [greeting, setGreeting] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await Promise.all([
          fetchCourses(),
          fetchTasks(),
          fetchNotes()
        ]);
      }
    };
    
    fetchData();
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [user, fetchCourses, fetchTasks, fetchNotes]);
  
  const todaysTasks = tasks
    .filter(task => isToday(new Date(task.due_date)))
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  
  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 3);
  
  const recentNotes = [...notes]
    .sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 3);

  const behindCourse = courses[0];

  const getTaskStatusColor = (task: any) => {
    if (task.status === 'completed') return 'bg-green-400';
    if (isPast(new Date(task.due_date))) return 'bg-red-400';
    return 'bg-blue-400';
  };

  return (
    <>
      {/* AI Assistant Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardBody className="p-6">
            <div className="flex items-start">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-2">Your AI Study Assistant</h2>
                <p className="mb-4 text-blue-100">
                  {tasks.length > 0 
                    ? "You have upcoming tasks that need your attention." 
                    : "Let's start by creating some tasks for your courses."}
                </p>
                <Button 
                  variant="ghost" 
                  className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                  onClick={() => { window.location.href = '/assistant'; }}
                >
                  Get Personalized Advice
                </Button>
              </div>
              <div className="hidden md:block w-32 h-32 bg-white bg-opacity-10 rounded-full ml-4 flex items-center justify-center">
                <TrendingUp size={64} className="text-white opacity-80" />
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <div className="space-y-6 mt-6">
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-800">
              {greeting}, {user?.email?.split('@')[0]}
            </h1>
            <p className="mt-1 text-gray-600">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </motion.div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button
              variant="outline"
              leftIcon={<Calendar size={16} />}
              onClick={() => setShowSchedule(!showSchedule)}
            >
              What's for today?
            </Button>
          </div>
        </div>

        {/* Today's Schedule */}
        <AnimatePresence>
          {showSchedule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
                <CardBody className="p-6">
                  {todaysTasks.length > 0 ? (
                    <div className="space-y-4">
                      {todaysTasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm"
                        >
                          <div className="w-12 text-sm text-gray-600">
                            {format(new Date(task.due_date), 'HH:mm')}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{task.title}</h3>
                            {task.course_id && (
                              <div className="text-sm text-gray-500">
                                {courses.find(c => c.id === task.course_id)?.name}
                              </div>
                            )}
                          </div>
                          <div className={`
                            px-2 py-1 rounded-full text-xs
                            ${task.priority === 'high' 
                              ? 'bg-red-100 text-red-700' 
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                            }
                          `}>
                            {task.priority}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-lg mb-2">Nothing scheduled for today. Take a break! 😊</div>
                      {behindCourse && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-700 mb-2">
                            <Brain size={20} />
                            <span className="font-medium">AI Suggestion</span>
                          </div>
                          <p className="text-gray-700 mb-3">
                            Hey! Your <span className="font-medium">{behindCourse.name}</span> needs some attention. 
                            You're 2 lessons behind schedule. Want to catch up with a quick session?
                          </p>
                          <Link to={`/courses/${behindCourse.id}`}>
                            <Button size="sm">
                              Go to Course
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card hover>
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <BookOpen size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Courses</p>
                    <h3 className="text-2xl font-bold">{courses.length}</h3>
                  </div>
                </div>
                <Link 
                  to="/courses" 
                  className="mt-4 text-sm text-blue-600 font-medium block hover:underline"
                >
                  View all courses →
                </Link>
              </CardBody>
            </Card>
          </motion.div>

          {/* Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Card hover>
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <CheckSquare size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Tasks</p>
                    <h3 className="text-2xl font-bold">
                      {tasks.filter(task => task.status !== 'completed').length}
                    </h3>
                  </div>
                </div>
                <Link 
                  to="/tasks" 
                  className="mt-4 text-sm text-blue-600 font-medium block hover:underline"
                >
                  Manage tasks →
                </Link>
              </CardBody>
            </Card>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Card hover>
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <FileText size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <h3 className="text-2xl font-bold">{notes.length}</h3>
                  </div>
                </div>
                <Link 
                  to="/notes" 
                  className="mt-4 text-sm text-blue-600 font-medium block hover:underline"
                >
                  View all notes →
                </Link>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};
