import React, { useState, useEffect } from 'react';
import { ChatWidget } from '../chat/ChatWidget';

import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CheckSquare,
  Brain,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../lib/store';
import { signOut } from '../../lib/supabase';

const sidebarLinks = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
  { icon: <FileText size={20} />, label: 'Notes', path: '/notes' },
  { icon: <Brain size={20} />, label: 'AI Assistant', path: '/assistant' },
];

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, courses, fetchCourses } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [avatarMenu, setAvatarMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    } else {
      fetchCourses();
    }
    // Hide avatar dropdown on route change
    setAvatarMenu(false);
    // eslint-disable-next-line
  }, [user, navigate, fetchCourses, location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    useAppStore.getState().setUser(null);
    navigate('/auth/login');
  };

  // Sidebar item active checker
  const isActive = (path: string) => location.pathname.startsWith(path);

  // Responsive Sidebar
  const renderSidebar = (isMobile = false) => (
    <motion.aside
      initial={{ x: isMobile ? '-100%' : 0 }}
      animate={{ x: 0 }}
      exit={{ x: isMobile ? '-100%' : 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
      className={`${
        isMobile
          ? "fixed z-50 inset-0 flex bg-black/40"
          : "hidden lg:flex"
      }`}
      style={{
        width: sidebarOpen ? 240 : 72,
        minWidth: sidebarOpen ? 240 : 72,
      }}
    >
      <div
        className={`
          flex flex-col h-full bg-white/80 border-r border-gray-200
          backdrop-blur-lg shadow-2xl transition-all duration-300
          ${sidebarOpen ? "" : "items-center"}
        `}
        style={{ width: sidebarOpen ? 240 : 72 }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <div
            className={`flex items-center gap-2 font-bold text-xl text-blue-600 transition-all ${
              sidebarOpen ? "" : "justify-center w-full"
            }`}
          >
            <img src="/logo.svg" alt="logo" className="w-7 h-7" />
            {sidebarOpen && <span>VISUAL STUDY</span>}
          </div>
          {isMobile ? (
            <button className="lg:hidden text-gray-500" onClick={() => setMobileSidebar(false)}>
              <X size={26} />
            </button>
          ) : (
            <button
              className="p-1 rounded hover:bg-gray-100 transition lg:inline-flex hidden"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-2">
          {sidebarLinks.map((item) => (
            <button
              key={item.path}
              className={`
                flex items-center gap-3 px-3 py-2 w-full
                rounded-lg transition
                ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }
                ${sidebarOpen ? "justify-start" : "justify-center"}
              `}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileSidebar(false);
              }}
              title={item.label}
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}

          {/* Courses Collapsible */}
          <div className="pt-3">
            <button
              className={`
                flex items-center w-full px-3 py-2 rounded-lg
                transition hover:bg-gray-100 text-gray-600
                ${sidebarOpen ? "justify-start" : "justify-center"}
              `}
              onClick={() => setCoursesOpen((v) => !v)}
              title="Courses"
            >
              <BookOpen size={20} className="mr-2" />
              {sidebarOpen && <span>Courses</span>}
              {sidebarOpen && (
                <>
                  {coursesOpen ? (
                    <ChevronDown size={16} className="ml-auto" />
                  ) : (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </>
              )}
            </button>
            <AnimatePresence>
              {coursesOpen && sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="pl-7 space-y-1"
                >
                  <span className="text-xs text-gray-400 font-semibold tracking-wider pl-2">MY COURSES</span>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <button
                        key={course.id}
                        className={`
                          block w-full text-left px-2 py-1.5 rounded-lg text-gray-600 hover:bg-blue-50 text-sm
                          ${isActive(`/courses/${course.id}`) ? "bg-blue-200/50 font-bold text-blue-700" : ""}
                        `}
                        onClick={() => {
                          navigate(`/courses/${course.id}`);
                          if (isMobile) setMobileSidebar(false);
                        }}
                      >
                        {course.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 px-2 py-2">No courses yet</p>
                  )}
                  <button
                    className="flex items-center gap-1 text-xs text-blue-600 mt-2 hover:underline"
                    onClick={() => {
                      navigate('/courses/new');
                      if (isMobile) setMobileSidebar(false);
                    }}
                  >
                    <PlusCircle size={14} /> Add Course
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* User & Sign out */}
        <div className={`px-3 pb-4 mt-auto w-full`}>
          <div
            className={`
              flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-100 cursor-pointer group
              ${sidebarOpen ? "justify-start" : "justify-center"}
              relative
            `}
            onClick={() => setAvatarMenu((v) => !v)}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-pink-400 flex items-center justify-center text-white font-bold shadow">
              <User size={20} />
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-semibold">{user?.email?.split('@')[0]}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            )}
          </div>
          <AnimatePresence>
            {avatarMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute z-40 left-4 right-4 bg-white shadow-xl rounded-xl mt-2 py-3 px-4"
              >
                <button
                  className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg hover:bg-red-50 text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {isMobile && <div className="flex-1" onClick={() => setMobileSidebar(false)} />}
    </motion.aside>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        {renderSidebar(false)}
      </div>
      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileSidebar && renderSidebar(true)}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className={`
          sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-white/80 border-b border-gray-200
          shadow-md backdrop-blur-md
        `}>
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-500 lg:hidden"
              onClick={() => setMobileSidebar(true)}
            >
              <Menu size={26} />
            </button>
            <button
              className={`hidden lg:inline-flex items-center p-2 text-gray-400 hover:text-blue-600 transition`}
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
            <span className="ml-2 font-bold text-blue-700 tracking-tight text-lg hidden sm:block">
              {sidebarOpen ? "Dashboard" : "DSH"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome back, <b>{user?.email?.split('@')[0]}</b>
            </span>
            <button
              className="relative"
              onClick={() => setAvatarMenu((v) => !v)}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-pink-400 flex items-center justify-center text-white font-bold shadow">
                <User size={20} />
              </div>
            </button>
          </div>
        </header>

        {/* Main content area */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.24, type: "spring" }}
          className="flex-1 overflow-y-auto p-5 sm:p-8 transition-all"
          style={{ minHeight: "calc(100vh - 64px)" }}
        >
          <Outlet />
        </motion.main>
        <ChatWidget />
      </div>
    </div>
  );
};
