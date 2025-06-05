import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FileText, Brain, User, LogOut } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { ChatWidget } from '../chat/ChatWidget';

const sidebarLinks = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
  { icon: <FileText size={20} />, label: 'Notes', path: '/notes' },
  { icon: <Brain size={20} />, label: 'AI Assistant', path: '/assistant' },
  { icon: <User size={20} />, label: 'Profile', path: '/profile' },
];

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAppStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col justify-between">
          {/* Logo and Navigation */}
          <div>
            <div className="flex h-16 items-center justify-center border-b">
              <h1 className="text-xl font-bold text-gray-800">StudyAI</h1>
            </div>
            <nav className="mt-4 space-y-1 px-3">
              {sidebarLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          
          {/* Sign Out Button */}
          <div className="p-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <LogOut size={20} />
              <span className="ml-3">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};