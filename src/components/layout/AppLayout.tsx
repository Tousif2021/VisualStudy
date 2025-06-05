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