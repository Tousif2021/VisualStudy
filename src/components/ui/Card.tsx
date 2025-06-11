import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  accent?: 'blue' | 'purple' | 'gradient' | null;
  glass?: boolean;
}

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  accent = null,
  glass = false
}) => {
  const baseStyles = `
    relative overflow-hidden rounded-xl
    ${glass 
      ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/20'
      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    }
    shadow-sm hover:shadow-md dark:shadow-gray-900/20
    transition-all duration-200
  `;

  const hoverStyles = hover 
    ? 'transform hover:-translate-y-1 cursor-pointer' 
    : '';
    
  const accentStyles = accent ? {
    blue: 'before:absolute before:inset-x-0 before:h-1 before:top-0 before:bg-blue-500',
    purple: 'before:absolute before:inset-x-0 before:h-1 before:top-0 before:bg-purple-500',
    gradient: 'before:absolute before:inset-x-0 before:h-1 before:top-0 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500'
  }[accent] : '';
  
  return (
    <motion.div 
      className={`${baseStyles} ${hoverStyles} ${accentStyles} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`
    px-6 py-4 border-b border-gray-100 dark:border-gray-700
    bg-gradient-to-b from-gray-50/50 dark:from-gray-700/50 to-transparent
    ${className}
  `}>
    {children}
  </div>
);

export const CardBody: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`
    px-6 py-4 border-t border-gray-100 dark:border-gray-700
    bg-gray-50/50 dark:bg-gray-700/50
    ${className}
  `}>
    {children}
  </div>
);