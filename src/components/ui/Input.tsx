import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  id,
  value,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const hasValue = typeof value === 'string' && value.length > 0;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-4 group`}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            peer w-full px-4 h-12
            text-gray-900 text-base
            bg-white rounded-xl
            border-2 border-gray-200
            shadow-sm
            transition-all duration-200
            focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
            placeholder-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-200
            ${leftIcon ? 'pl-11' : ''}
            ${rightIcon ? 'pr-11' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          placeholder={label || props.placeholder || ' '}
          {...props}
        />
        
        {label && (
          <label
            htmlFor={inputId}
            className={`
              absolute left-2 px-2 transition-all duration-200 pointer-events-none
              ${focused || hasValue 
                ? '-top-2.5 text-sm bg-white'
                : 'top-3.5 text-base bg-transparent'
              }
              ${focused ? 'text-blue-500' : 'text-gray-500'}
              ${error ? '!text-red-500' : ''}
            `}
          >
            {label}
          </label>
        )}

        {leftIcon && (
          <span className={`
            absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
            ${focused ? 'text-blue-500' : 'text-gray-400'}
            ${error ? '!text-red-500' : ''}
          `}>
            {leftIcon}
          </span>
        )}

        {rightIcon && (
          <span className={`
            absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200
            ${focused ? 'text-blue-500' : 'text-gray-400'}
            ${error ? '!text-red-500' : ''}
          `}>
            {rightIcon}
          </span>
        )}
      </div>

      {(error || helperText) && (
        <div className="mt-1.5 px-4 text-xs min-h-[1.25rem]">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <span className="text-gray-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';