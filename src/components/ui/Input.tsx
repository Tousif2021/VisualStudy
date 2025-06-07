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
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-6`}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            peer w-full h-14 px-4 pt-6 pb-2
            text-gray-900 text-base font-medium
            bg-white/80 backdrop-blur-sm
            border border-gray-200/60
            rounded-2xl
            shadow-sm
            transition-all duration-300 ease-out
            focus:outline-none 
            focus:border-blue-500/60 
            focus:shadow-lg 
            focus:shadow-blue-500/10
            focus:bg-white
            hover:border-gray-300/80
            hover:shadow-md
            placeholder-transparent
            disabled:bg-gray-50/80 
            disabled:cursor-not-allowed 
            disabled:border-gray-200/40
            disabled:text-gray-400
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
            ${error ? 'border-red-400/60 focus:border-red-500/60 focus:shadow-red-500/10' : ''}
            ${className}
          `}
          placeholder={label || props.placeholder || ' '}
          {...props}
        />
        
        {label && (
          <label
            htmlFor={inputId}
            className={`
              absolute left-4 transition-all duration-300 ease-out pointer-events-none
              font-medium tracking-wide
              ${focused || hasValue 
                ? 'top-2 text-xs text-gray-500' 
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
              }
              ${focused ? 'text-blue-600' : ''}
              ${error ? '!text-red-500' : ''}
              ${leftIcon && !(focused || hasValue) ? 'left-12' : ''}
            `}
          >
            {label}
          </label>
        )}

        {leftIcon && (
          <span className={`
            absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300
            ${focused ? 'text-blue-600' : 'text-gray-400'}
            ${error ? '!text-red-500' : ''}
          `}>
            {leftIcon}
          </span>
        )}

        {rightIcon && (
          <span className={`
            absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300
            ${focused ? 'text-blue-600' : 'text-gray-400'}
            ${error ? '!text-red-500' : ''}
          `}>
            {rightIcon}
          </span>
        )}
      </div>

      {(error || helperText) && (
        <div className="mt-2 px-4 text-sm min-h-[1.25rem]">
          {error ? (
            <span className="text-red-500 font-medium">{error}</span>
          ) : (
            <span className="text-gray-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';