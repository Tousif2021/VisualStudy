import React from 'react';
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
  Link2
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
  { icon: <User size={20} />, label: 'Profile', path: '/profile' },
];

export const AppLayout = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAppStore();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  if (!user) {
    return <Navigate to="/auth/login\" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 flex items-center border-b">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="text-blue-600" size={24} />
              <span className="font-bold text-xl">StudyAI</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-full p-2"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default AppLayout;