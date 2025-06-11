import React, { useState, useEffect } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  variant?: 'default' | 'glass' | 'minimal';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  loading = false,
  variant = 'default',
  className = '',
  id,
  value,
  onFocus,
  onBlur,
  disabled,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  useEffect(() => {
    setHasValue(Boolean(value && String(value).length > 0));
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return `
          bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-blue-200 dark:border-blue-700
          shadow-[0_4px_24px_rgba(45,77,253,0.05)] dark:shadow-[0_4px_24px_rgba(45,77,253,0.1)]
          hover:bg-white/40 dark:hover:bg-gray-800/40 hover:border-blue-400 dark:hover:border-blue-600
          focus:bg-white/50 dark:focus:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-400
        `;
      case 'minimal':
        return `
          bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-600 rounded-none
          shadow-none hover:border-gray-300 dark:hover:border-gray-500
          focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-none
        `;
      default:
        return `
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
          shadow-sm
          hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md
          focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
        `;
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-4`}>
      {/* Label - Always visible above the input */}
      {label && (
        <label
          htmlFor={inputId}
          className={`
            block text-sm font-medium mb-2
            ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
            ${isDisabled ? 'text-gray-400 dark:text-gray-500' : ''}
          `}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Input Container */}
        <div className={`
          relative rounded-lg
          transition-all duration-200 ease-out
          ${getVariantStyles()}
          ${error ? 'border-red-300 dark:border-red-600 ring-2 ring-red-200 dark:ring-red-800' : ''}
          ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}>
          {/* Left Icon */}
          {leftIcon && (
            <div className={`
              absolute left-3 top-1/2 -translate-y-1/2 z-10
              transition-all duration-200
              ${focused ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
              ${error ? '!text-red-500 dark:!text-red-400' : ''}
              ${isDisabled ? 'text-gray-300 dark:text-gray-600' : ''}
            `}>
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isDisabled}
            className={`
              w-full h-10 px-3
              text-gray-900 dark:text-gray-100 text-sm
              bg-transparent border-0 outline-none
              transition-all duration-200
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || loading ? 'pr-10' : ''}
              ${className}
            `}
            placeholder={props.placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {/* Right Icon / Loading */}
          {(rightIcon || loading) && (
            <div className={`
              absolute right-3 top-1/2 -translate-y-1/2 z-10
              transition-all duration-200
              ${focused ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
              ${error ? '!text-red-500 dark:!text-red-400' : ''}
              ${isDisabled ? 'text-gray-300 dark:text-gray-600' : ''}
            `}>
              {loading ? (
                <div className="relative">
                  <div className="w-4 h-4 border-2 border-gray-200 dark:border-gray-600 rounded-full" />
                  <div className="absolute inset-0 w-4 h-4 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
      </div>

      {/* Helper Text / Error */}
      {(error || helperText) && (
        <div className="mt-1">
          {error ? (
            <div 
              id={`${inputId}-error`}
              className="text-xs text-red-600 dark:text-red-400"
              role="alert"
            >
              {error}
            </div>
          ) : (
            <div 
              id={`${inputId}-helper`}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {helperText}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';