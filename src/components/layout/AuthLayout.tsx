import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export const AuthLayout: React.FC = () => {
  const { user } = useAppStore();
  
  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen size={36} />
            <h1 className="text-3xl font-bold">VISUAL STUDY</h1>
          </div>
          <p className="mt-6 text-blue-100 text-lg leading-relaxed">
            Your AI-powered study management platform for academic success.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-semibold mb-6">Why choose VISUAL STUDY?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white">
                <span>1</span>
              </div>
              <div>
                <h3 className="font-medium">AI-Powered Learning</h3>
                <p className="text-blue-100 mt-1">Our AI automatically generates summaries, quizzes, and flashcards from your documents.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white">
                <span>2</span>
              </div>
              <div>
                <h3 className="font-medium">Personalized Feedback</h3>
                <p className="text-blue-100 mt-1">Get insights on your progress and personalized recommendations to improve.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white">
                <span>3</span>
              </div>
              <div>
                <h3 className="font-medium">All-in-One Platform</h3>
                <p className="text-blue-100 mt-1">Manage courses, documents, tasks, and notes in one integrated platform.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center lg:hidden mb-8">
            <BookOpen size={32} className="text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-blue-600">VISUAL STUDY</h1>
          </div>
          
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};