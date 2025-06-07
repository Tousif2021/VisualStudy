import React, { useState, useEffect } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  loading = false,
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

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative group`}>
      <div className="relative">
        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isDisabled}
          className={`
            peer w-full h-16 px-5 pt-7 pb-3
            text-gray-900 text-base font-medium tracking-wide
            bg-white/95 backdrop-blur-xl
            border-2 border-gray-200/80
            rounded-3xl
            shadow-sm shadow-gray-900/5
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            focus:outline-none 
            focus:border-blue-500/80 
            focus:shadow-2xl 
            focus:shadow-blue-500/20
            focus:bg-white
            focus:scale-[1.02]
            hover:border-gray-300/90
            hover:shadow-lg
            hover:shadow-gray-900/10
            placeholder-transparent
            autofill:bg-blue-50/50
            disabled:bg-gray-50/80 
            disabled:cursor-not-allowed 
            disabled:border-gray-200/50
            disabled:text-gray-400
            disabled:shadow-none
            ${leftIcon ? 'pl-14' : ''}
            ${rightIcon ? 'pr-14' : ''}
            ${error ? 'border-red-400/80 focus:border-red-500/80 focus:shadow-red-500/20 bg-red-50/30' : ''}
            ${className}
          `}
          placeholder={label || props.placeholder || ' '}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {/* Floating Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`
              absolute left-5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none
              font-semibold tracking-wide select-none
              ${focused || hasValue 
                ? 'top-2.5 text-xs text-gray-600 scale-95' 
                : 'top-1/2 -translate-y-1/2 text-base text-gray-500 scale-100'
              }
              ${focused ? 'text-blue-600' : ''}
              ${error ? '!text-red-600' : ''}
              ${leftIcon && !(focused || hasValue) ? 'left-14' : ''}
              ${isDisabled ? 'text-gray-400' : ''}
            `}
          >
            {label}
          </label>
        )}

        {/* Left Icon */}
        {leftIcon && (
          <div className={`
            absolute left-5 top-1/2 -translate-y-1/2 
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${focused ? 'text-blue-600 scale-110' : 'text-gray-500'}
            ${error ? '!text-red-600' : ''}
            ${isDisabled ? 'text-gray-400' : ''}
          `}>
            {leftIcon}
          </div>
        )}

        {/* Right Icon / Loading */}
        {(rightIcon || loading) && (
          <div className={`
            absolute right-5 top-1/2 -translate-y-1/2 
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${focused ? 'text-blue-600 scale-110' : 'text-gray-500'}
            ${error ? '!text-red-600' : ''}
            ${isDisabled ? 'text-gray-400' : ''}
          `}>
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              rightIcon
            )}
          </div>
        )}

        {/* Focus Ring */}
        <div className={`
          absolute inset-0 rounded-3xl pointer-events-none
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${focused ? 'ring-4 ring-blue-500/20 scale-105' : 'ring-0 scale-100'}
          ${error ? 'ring-red-500/20' : ''}
        `} />
      </div>

      {/* Helper Text / Error */}
      {(error || helperText) && (
        <div className="mt-3 px-5">
          {error ? (
            <div 
              id={`${inputId}-error`}
              className="flex items-center gap-2 text-sm font-medium text-red-600"
              role="alert"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          ) : (
            <div 
              id={`${inputId}-helper`}
              className="text-sm text-gray-600 font-medium"
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