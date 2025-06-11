import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'button', 
  size = 'md',
  className = '' 
}) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  
  const buttonClasses = `
    relative p-2 rounded-lg transition-all duration-200 
    hover:bg-gray-100 dark:hover:bg-gray-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    dark:focus:ring-offset-gray-900
    ${className}
  `;

  if (variant === 'button') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={buttonClasses}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'light' ? (
              <Sun size={iconSize} className="text-yellow-500" />
            ) : (
              <Moon size={iconSize} className="text-blue-400" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={buttonClasses}
        aria-label="Theme options"
      >
        {theme === 'light' ? (
          <Sun size={iconSize} className="text-yellow-500" />
        ) : (
          <Moon size={iconSize} className="text-blue-400" />
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-full mt-2 z-20 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
            >
              {[
                { key: 'light', label: 'Light', icon: Sun },
                { key: 'dark', label: 'Dark', icon: Moon },
                { key: 'system', label: 'System', icon: Monitor }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'system') {
                      // Remove saved preference to follow system
                      localStorage.removeItem('visualstudy-theme');
                      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                      setTheme(systemTheme);
                    } else {
                      setTheme(key as 'light' | 'dark');
                    }
                    setShowDropdown(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 text-sm
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    text-gray-700 dark:text-gray-300
                    ${theme === key ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}
                  `}
                >
                  <Icon size={16} />
                  {label}
                  {theme === key && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};