import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  Brain,
  ChevronRight,
  Zap
} from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SmartRevision } from '../components/dashboard/SmartRevision';
import { useAppStore } from '../lib/store';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, courses, tasks, notes, fetchCourses, fetchTasks, fetchNotes } = useAppStore();
  const [greeting, setGreeting] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [showSmartRevision, setShowSmartRevision] = useState(true);
  
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {greeting}, {user?.name?.split('@')[0]}
          </h1>
          <p className="mt-1 text-gray-600">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </motion.div>
      </div>

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
                  variant="outline"
                  leftIcon={<Calendar size={16} />}
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="border-white/30 text-blue hover:bg-blue/10"
                >
                  What's for today?
                </Button>
              </div>
              <div className="hidden md:block w-32 h-32 bg-white bg-opacity-10 rounded-full ml-4 flex items-center justify-center">
                <TrendingUp size={64} className="text-white opacity-80" />
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Smart Revision Section */}
      <AnimatePresence>
        {showSmartRevision && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SmartRevision />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Green Glowing Button in the Middle */}
      <div className="flex justify-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="relative"
        >
          {/* Glowing effect */}
          <div className="absolute inset-0 rounded-full bg-green-400 blur-lg opacity-60 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-green-300 blur-md opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Button */}
          <p>Let the AI analyse your performance and help you to get better </p>
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-bold shadow-2xl border-2 border-green-400 hover:border-green-300 transition-all duration-300"
            leftIcon={<Zap size={20} />}
            onClick={() => setShowSmartRevision(!showSmartRevision)}
          >
            {showSmartRevision ? 'Hide Smart Insights' : 'Show Smart Insights'}
          </Button>
        </motion.div>
      </div>

      {/* Tasks and Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks List */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
            <Link to="/tasks">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardBody>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`
                      w-2 h-2 rounded-full
                      ${task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 
                        'bg-green-500'}
                    `} />
                    <div className="flex-1">
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        Due {format(new Date(task.due_date), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    {task.course_id && (
                      <div className="text-sm text-gray-500">
                        {courses.find(c => c.id === task.course_id)?.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No upcoming tasks
              </div>
            )}
          </CardBody>
        </Card>

        {/* Notes List */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Notes</h2>
            <Link to="/notes">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardBody>
            {recentNotes.length > 0 ? (
              <div className="space-y-3">
                {recentNotes.map(note => (
                  <div
                    key={note.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{note.title}</h3>
                      <span className="text-sm text-gray-500">
                        {format(new Date(note.updated_at), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {note.content}
                    </p>
                    {note.course_id && (
                      <div className="mt-2 text-sm text-gray-500">
                        {courses.find(c => c.id === note.course_id)?.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No notes yet
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};