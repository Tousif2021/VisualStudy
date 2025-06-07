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
          bg-white/30 backdrop-blur-lg border border-blue-200
          shadow-[0_4px_24px_rgba(45,77,253,0.05)]
          hover:bg-white/40 hover:border-blue-400
          focus:bg-white/50 focus:border-blue-500
        `;
      case 'minimal':
        return `
          bg-transparent border-0 border-b-2 border-gray-200 rounded-none
          shadow-none hover:border-gray-300
          focus:border-blue-500 focus:shadow-none
        `;
      default:
        return `
          bg-gradient-to-br from-white via-gray-50/80 to-white
          border border-blue-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_25px_-5px_rgba(0,0,0,0.03)]
          hover:shadow-[0_4px_6px_rgba(0,0,0,0.07),0_25px_50px_-12px_rgba(0,0,0,0.08)]
          focus:shadow-[0_0_0_3px_rgba(59,130,246,0.11),0_25px_50px_-12px_rgba(59,130,246,0.14)]
        `;
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative group mb-4`}>
      {/* Background Glow Effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 transition-opacity duration-700 pointer-events-none
        ${focused ? 'opacity-100' : ''}
        bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-emerald-400/10
        blur-lg scale-105
      `} />

      <div className="relative">
        {/* Input Container */}
        <div className={`
          relative overflow-hidden rounded-xl
          transition-all duration-300 ease-out
          ${focused ? 'scale-[1.01] ring-2 ring-blue-300' : ''}
          ${getVariantStyles()}
          ${error ? 'border-red-300 ring-2 ring-red-200' : ''}
          ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}>

          {/* Floating Label */}
          {label && (
            <label
              htmlFor={inputId}
              className={`
                absolute left-3 z-10 pointer-events-none select-none
                font-medium transition-all duration-200 ease-out bg-transparent
                px-1
                ${
                  focused || hasValue
                    ? 'top-1 text-xs text-blue-600 bg-white/80'
                    : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                }
                ${error ? '!text-red-500' : ''}
                ${isDisabled ? 'text-gray-400' : ''}
              `}
              style={{
                background: (focused || hasValue) ? 'rgba(255,255,255,0.85)' : 'transparent',
                paddingLeft: '2px',
                paddingRight: '2px'
              }}
            >
              {label}
            </label>
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
              relative w-full h-10 px-3 pt-4 pb-1
              text-gray-900 text-sm font-medium
              bg-transparent border-0 outline-none
              placeholder-transparent
              transition-all duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || loading ? 'pr-10' : ''}
              ${variant === 'minimal' ? 'h-9 pt-4' : ''}
              ${className}
            `}
            placeholder={label || props.placeholder || ' '}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {/* Left Icon */}
          {leftIcon && (
            <div className={`
              absolute left-3 top-1/2 -translate-y-1/2
              transition-all duration-200
              ${focused ? 'text-blue-600 scale-110' : 'text-gray-400'}
              ${error ? '!text-red-500' : ''}
              ${isDisabled ? 'text-gray-300' : ''}
            `}>
              {leftIcon}
            </div>
          )}

          {/* Right Icon / Loading */}
          {(rightIcon || loading) && (
            <div className={`
              absolute right-3 top-1/2 -translate-y-1/2
              transition-all duration-200
              ${focused ? 'text-blue-600 scale-110' : 'text-gray-400'}
              ${error ? '!text-red-500' : ''}
              ${isDisabled ? 'text-gray-300' : ''}
            `}>
              {loading ? (
                <div className="relative">
                  <div className="w-4 h-4 border-2 border-gray-200 rounded-full" />
                  <div className="absolute inset-0 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
        <div className="mt-1 px-1">
          {error ? (
            <div 
              id={`${inputId}-error`}
              className="flex items-center gap-2 text-xs font-medium text-red-600 animate-in slide-in-from-left-2 duration-300"
              role="alert"
            >
              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          ) : (
            <div 
              id={`${inputId}-helper`}
              className="text-xs text-gray-500 font-medium"
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
