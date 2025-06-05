import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Brain, 
  User, 
  LogOut,
  BookOpen,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Mic,
  Link2
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { ChatWidget } from '../chat/ChatWidget';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarLinks = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
  { icon: <FileText size={20} />, label: 'Notes', path: '/notes' },
  { icon: <Brain size={20} />, label: 'AI Assistant', path: '/assistant' },
  { icon: <Mic size={20} />, label: 'Voice Coach', path: '/voice-coach' },
  { icon: <Link2 size={20} />, label: 'Link Repository', path: '/links' },
  { icon: <User size={20} />, label: 'Profile', path: '/profile' },
];

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="text-primary" size={24} />
              {isSidebarOpen && <span className="font-bold text-xl">StudyAI</span>}
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors ${
                    isActive ? 'bg-primary/10 text-primary' : ''
                  }`
                }
              >
                {link.icon}
                {isSidebarOpen && <span className="ml-3">{link.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="ml-3">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
        <ChatWidget />
      </main>
    </div>
  );
};