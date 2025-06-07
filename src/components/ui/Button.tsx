import React, { useRef } from 'react';
import { motion } from 'framer-motion';

// New: Icon-only style!
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  ripple?: boolean;
  uppercase?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-blue-600 text-white shadow-md hover:bg-blue-700 
    active:shadow-none focus:ring-2 focus:ring-blue-400
    border border-transparent
    `,
  secondary: `
    bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200 
    active:shadow-none focus:ring-2 focus:ring-gray-400
    border border-transparent
    `,
  outline: `
    bg-white border border-gray-300 text-gray-700 hover:bg-gray-50
    active:bg-gray-100 focus:ring-2 focus:ring-blue-400
    `,
  text: `
    bg-transparent text-blue-700 hover:bg-blue-50
    active:bg-blue-100 focus:ring-2 focus:ring-blue-400
    border border-transparent
    `,
  danger: `
    bg-red-600 text-white shadow-md hover:bg-red-700
    active:shadow-none focus:ring-2 focus:ring-red-400
    border border-transparent
    `,
  ghost: `
    bg-transparent hover:bg-gray-100 active:bg-gray-200
    text-gray-600 hover:text-gray-900
    border border-transparent
    `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5 rounded-lg min-h-[32px]',
  md: 'text-sm px-4 py-2 rounded-lg min-h-[40px]',
  lg: 'text-base px-6 py-2.5 rounded-lg min-h-[48px]',
};

// Ripple effect
function useRipple(disabled: boolean) {
  const btnRef = useRef<HTMLButtonElement>(null);

  function createRipple(event: React.MouseEvent) {
    if (disabled) return;
    const button = btnRef.current;
    if (!button) return;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    // Remove old ripple
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  }

  return { btnRef, createRipple };
}

// CSS for ripple
const rippleStyles = `
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 550ms linear;
  background-color: rgba(60, 132, 246, 0.3);
  pointer-events: none;
  z-index: 2;
}
@keyframes ripple {
  to {
    transform: scale(2.6);
    opacity: 0;
  }
}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ripple = true,
  uppercase = false,
  ...props
}) => {
  const { btnRef, createRipple } = useRipple(Boolean(disabled || isLoading || !ripple));

  return (
    <>
      <style>{rippleStyles}</style>
      <motion.button
        ref={btnRef}
        whileTap={{ scale: 0.97 }}
        className={`
          relative overflow-hidden select-none
          font-medium focus:outline-none
          inline-flex items-center justify-center
          transition-all duration-200
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
          ${uppercase ? 'uppercase tracking-wide' : ''}
        `}
        disabled={disabled || isLoading}
        tabIndex={0}
        onClick={(e) => {
          if (ripple && !isLoading && !disabled) createRipple(e);
          if (props.onClick) props.onClick(e);
        }}
        {...props}
        aria-busy={isLoading}
      >
        {isLoading ? (
          // Loading spinner
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="inline-block w-4 h-4 align-middle">
              <svg className="animate-spin w-4 h-4 text-current" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {leftIcon && <span className="flex items-center">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="flex items-center">{rightIcon}</span>}
          </span>
        )}
      </motion.button>
    </>
  );
};