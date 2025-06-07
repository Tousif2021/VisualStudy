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
  Settings,
  Bell
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { ChatWidget } from '../chat/ChatWidget';

const sidebarLinks = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
  { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
  { icon: <FileText size={20} />, label: 'Notes', path: '/notes' },
  { icon: <Brain size={20} />, label: 'AI Assistant', path: '/assistant' },
  { icon: <Mic size={20} />, label: 'Voice Coach', path: '/voice-coach' },
  { icon: <Link2 size={20} />, label: 'Links', path: '/links' },
];

const bottomLinks = [
  { icon: <Settings size={20} />, label: 'Settings', path: '/profile' },
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
    return <Navigate to="/auth/login\" replace />;
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`
        flex items-center gap-3 p-4 border-b border-gray-800/50
        ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}
      `}>
        {(!isCollapsed || isMobile) && (
          <Link to="/dashboard\" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white">StudyAI</span>
          </Link>
        )}
        
        {isCollapsed && !isMobile && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
        )}

        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} className={`transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        )}

        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* User Profile */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
            <button className="p-1 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors">
              <Bell size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                } ${isCollapsed && !isMobile ? 'justify-center' : ''}`
              }
              title={isCollapsed && !isMobile ? link.label : undefined}
            >
              <span className={`transition-transform duration-200 ${
                isCollapsed && !isMobile ? '' : 'group-hover:scale-110'
              }`}>
                {link.icon}
              </span>
              {(!isCollapsed || isMobile) && (
                <span className="font-medium">{link.label}</span>
              )}
              {(!isCollapsed || isMobile) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Links */}
        <div className="mt-8 pt-4 border-t border-gray-800/50 space-y-1">
          {bottomLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                } ${isCollapsed && !isMobile ? 'justify-center' : ''}`
              }
              title={isCollapsed && !isMobile ? link.label : undefined}
            >
              <span className={`transition-transform duration-200 ${
                isCollapsed && !isMobile ? '' : 'group-hover:scale-110'
              }`}>
                {link.icon}
              </span>
              {(!isCollapsed || isMobile) && (
                <span className="font-medium">{link.label}</span>
              )}
            </NavLink>
          ))}

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-400 hover:text-red-400 hover:bg-red-500/10 ${
              isCollapsed && !isMobile ? 'justify-center' : ''
            }`}
            title={isCollapsed && !isMobile ? 'Sign Out' : undefined}
          >
            <span className={`transition-transform duration-200 ${
              isCollapsed && !isMobile ? '' : 'group-hover:scale-110'
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
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex flex-col
        bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800
        border-r border-gray-800/50 shadow-2xl
        transition-all duration-300 ease-out
        ${isCollapsed ? 'w-16' : 'w-64'}
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
          <aside className="relative w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 border-r border-gray-800/50 shadow-2xl">
            <SidebarContent isMobile />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu size={20} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">StudyAI</span>
          </Link>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
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