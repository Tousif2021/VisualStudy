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
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-4`}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            peer w-full rounded-t-md rounded-b-none px-3 pt-6 pb-2
            text-gray-900 text-base
            border-0 border-b-2 border-gray-300
            bg-gray-50/50
            transition-all duration-200
            focus:outline-none focus:border-blue-500 focus:ring-0
            placeholder-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          placeholder={label || props.placeholder || ' '}
          {...props}
        />
        
        {label && (
          <label
            htmlFor={inputId}
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
              ${focused || hasValue 
                ? 'top-1 text-xs text-blue-600'
                : 'top-4 text-base text-gray-500'
              }
              ${error ? 'text-red-500' : ''}
            `}
          >
            {label}
          </label>
        )}

        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </span>
        )}

        <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
          <div className={`
            absolute inset-0 w-full h-full bg-blue-500 transform origin-left scale-x-0 transition-transform duration-200
            ${focused ? 'scale-x-100' : ''}
            ${error ? 'bg-red-500' : ''}
          `} />
        </div>
      </div>

      {(error || helperText) && (
        <div className="mt-1 text-xs min-h-[1.25rem]">
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