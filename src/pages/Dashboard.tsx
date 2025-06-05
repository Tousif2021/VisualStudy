diff --git a/src/pages/Dashboard.tsx b/src/pages/Dashboard.tsx
index bdc55f8b265afc9925fd915c3851b18ac39af586..a3accbf3a46a9f5695f9a8125acb21fc6d91e85a 100644
--- a/src/pages/Dashboard.tsx
+++ b/src/pages/Dashboard.tsx
@@ -1,157 +1,146 @@
 import React, { useEffect, useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
-import { 
-  BookOpen, 
-  CheckSquare, 
-  FileText, 
-  Calendar, 
+import {
+  BookOpen,
+  CheckSquare,
+  FileText,
+  Calendar,
   TrendingUp,
   AlertTriangle,
-  Clock,
-  ChevronDown,
-  ChevronUp,
-  BookOpen as CourseIcon,
-  CheckCircle,
-  AlertCircle,
   Brain
 } from 'lucide-react';
-import { format, isToday, isPast, isFuture } from 'date-fns';
+import { format, isToday } from 'date-fns';
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
     
     // Set greeting based on time of day
     const hour = new Date().getHours();
     if (hour < 12) setGreeting('Good morning');
     else if (hour < 18) setGreeting('Good afternoon');
     else setGreeting('Good evening');
   }, [user, fetchCourses, fetchTasks, fetchNotes]);
-  {/* AI Assistant Card */}
-      <motion.div
-        initial={{ opacity: 0, y: 20 }}
-        animate={{ opacity: 1, y: 0 }}
-        transition={{ delay: 0.1, duration: 0.3 }}
-      >
-        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
-          <CardBody className="p-6">
-            <div className="flex items-start">
-              <div className="flex-grow">
-                <h2 className="text-xl font-semibold mb-2">Your AI Study Assistant</h2>
-                <p className="mb-4 text-blue-100">
-                  {tasks.length > 0 
-                    ? "You have upcoming tasks that need your attention." 
-                    : "Let's start by creating some tasks for your courses."}
-                </p>
-                <Button 
-                  variant="ghost" 
-                  className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
-                  onClick={() => { window.location.href = '/assistant'; }}
-                >
-                  Get Personalized Advice
-                </Button>
-              </div>
-              <div className="hidden md:block w-32 h-32 bg-white bg-opacity-10 rounded-full ml-4 flex items-center justify-center">
-                <TrendingUp size={64} className="text-white opacity-80" />
-              </div>
-            </div>
-          </CardBody>
-        </Card>
-      </motion.div>
   // Get today's tasks
   const todaysTasks = tasks
     .filter(task => isToday(new Date(task.due_date)))
     .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
   
   // Get upcoming tasks
   const upcomingTasks = tasks
     .filter(task => task.status !== 'completed')
     .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
     .slice(0, 3);
   
   // Get recent notes
   const recentNotes = [...notes]
     .sort((a, b) => 
       new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
     )
     .slice(0, 3);
 
   // Simulate an AI recommendation for a course that needs attention
   const behindCourse = courses[0]; // This would normally come from AI analysis
-
-  const getTaskStatusColor = (task: any) => {
-    if (task.status === 'completed') return 'bg-green-400';
-    if (isPast(new Date(task.due_date))) return 'bg-red-400';
-    return 'bg-blue-400';
-  };
   
   return (
     <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
         >
-          <h1 className="text-3xl font-bold text-gray-800">
+          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
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
 
+      {/* AI Assistant Card */}
+      <motion.div
+        initial={{ opacity: 0, y: 20 }}
+        animate={{ opacity: 1, y: 0 }}
+        transition={{ delay: 0.1, duration: 0.3 }}
+      >
+        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
+          <CardBody className="p-6">
+            <div className="flex items-start">
+              <div className="flex-grow">
+                <h2 className="text-xl font-semibold mb-2">Your AI Study Assistant</h2>
+                <p className="mb-4 text-blue-100">
+                  {tasks.length > 0
+                    ? 'You have upcoming tasks that need your attention.'
+                    : "Let's start by creating some tasks for your courses."}
+                </p>
+                <Button
+                  variant="ghost"
+                  className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
+                  onClick={() => { window.location.href = '/assistant'; }}
+                >
+                  Get Personalized Advice
+                </Button>
+              </div>
+              <div className="hidden md:block w-32 h-32 bg-white bg-opacity-10 rounded-full ml-4 flex items-center justify-center">
+                <TrendingUp size={64} className="text-white opacity-80" />
+              </div>
+            </div>
+          </CardBody>
+        </Card>
+      </motion.div>
+
       {/* Today's Schedule Button Result */}
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
