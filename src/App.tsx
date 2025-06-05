import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './components/layout/AuthLayout';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { CourseList } from './pages/courses/CourseList';
import { NewCourse } from './pages/courses/NewCourse';
import { CourseDashboard } from './pages/courses/CourseDashboard';
import { Assistant } from './pages/Assistant';
import { Notes } from './pages/Notes';
import { Tasks } from './pages/Tasks';
import { Profile } from './pages/Profile';
import { useAppStore } from './lib/store';

function App() {
  const { initAuth } = useAppStore();
  
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="" element={<Navigate to="/auth/login" replace />} />
        </Route>
        
        {/* App Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/new" element={<NewCourse />} />
          <Route path="courses/:id" element={<CourseDashboard />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="notes" element={<Notes />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;