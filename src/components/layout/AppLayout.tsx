import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Brain, 
  User, 
  LogOut,
  BookOpen,
  Mic,
  Link2,
  Menu,
  X,
  ChevronLeft,
  Zap
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { ChatWidget } from '../chat/ChatWidget';
import { ThemeToggle } from '../ui/ThemeToggle';

const sidebarLinks = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
  { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
  { icon: <FileText size={20} />, label: 'Notes', path: '/notes' },
  { icon: <Mic size={20} />, label: 'Voice Coach', path: '/voice-coach' },
  { icon: <Link2 size={20} />, label: 'Links', path: '/links' },
  { icon: <User size={20} />, label: 'Profile', path: '/profile' },
];

export const AppLayout = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAppStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`
        flex items-center p-4 border-b border-gray-200 dark:border-gray-700 relative
        ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}
      `}>
        {(!isCollapsed || isMobile) && (
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">VisualStudy</span>
          </Link>
        )}
        
        {isCollapsed && !isMobile && (
          <Link to="/dashboard" className="group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Zap size={20} className="text-white" />
            </div>
          </Link>
        )}

        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              absolute -right-3 top-1/2 -translate-y-1/2 z-10
              w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600
              flex items-center justify-center
              hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500
              text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
              transition-all duration-200 hover:scale-110
              shadow-lg
            `}
          >
            <ChevronLeft size={12} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        )}

        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group relative flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${isCollapsed && !isMobile ? 'justify-center' : 'gap-3'}`
              }
            >
              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-gray-700 dark:border-gray-600 shadow-xl">
                  {link.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 border-l border-b border-gray-700 dark:border-gray-600"></div>
                </div>
              )}
              
              <span className={`transition-all duration-200 flex items-center justify-center ${
                isCollapsed && !isMobile ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {link.icon}
              </span>
              
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="font-medium">{link.label}</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Theme Toggle and Sign Out */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Theme Toggle */}
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'gap-3 px-3'}`}>
            {(!isCollapsed || isMobile) && (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Theme</span>
            )}
            <ThemeToggle variant="dropdown" />
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className={`group relative w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${
              isCollapsed && !isMobile ? 'justify-center' : 'gap-3'
            }`}
          >
            {/* Tooltip for collapsed state */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-gray-700 dark:border-gray-600 shadow-xl">
                Sign Out
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 border-l border-b border-gray-700 dark:border-gray-600"></div>
              </div>
            )}
            
            <span className={`transition-all duration-200 flex items-center justify-center ${
              isCollapsed && !isMobile ? 'scale-110' : 'group-hover:scale-110'
            }`}>
              <LogOut size={20} />
            </span>
            
            {(!isCollapsed || isMobile) && (
              <span className="font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex flex-col
        bg-white dark:bg-gray-800
        border-r border-gray-200 dark:border-gray-700 shadow-lg
        transition-all duration-300 ease-out relative
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-2xl">
            <SidebarContent isMobile />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Menu size={20} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">VisualStudy</span>
          </Link>
          <ThemeToggle />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default AppLayout;