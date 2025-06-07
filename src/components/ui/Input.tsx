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
          bg-white/10 backdrop-blur-2xl border border-white/20
          shadow-[0_8px_32px_rgba(0,0,0,0.1)] 
          hover:bg-white/15 hover:border-white/30
          focus:bg-white/20 focus:border-blue-400/50
        `;
      case 'minimal':
        return `
          bg-transparent border-0 border-b-2 border-gray-200 rounded-none
          shadow-none hover:border-gray-300
          focus:border-blue-500 focus:shadow-none
        `;
      default:
        return `
          bg-gradient-to-br from-white via-gray-50/50 to-white
          border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_-5px_rgba(0,0,0,0.04)]
          hover:shadow-[0_4px_6px_rgba(0,0,0,0.05),0_25px_50px_-12px_rgba(0,0,0,0.08)]
          focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1),0_25px_50px_-12px_rgba(59,130,246,0.15)]
        `;
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative group mb-6`}>
      {/* Background Glow Effect */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700
        ${focused ? 'opacity-100' : ''}
        bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10
        blur-xl scale-110
      `} />

      <div className="relative">
        {/* Input Container */}
        <div className={`
          relative overflow-hidden rounded-2xl
          transition-all duration-500 ease-out
          ${focused ? 'scale-[1.01] rotate-[0.2deg]' : 'scale-100 rotate-0'}
          ${getVariantStyles()}
          ${error ? 'border-red-300 shadow-red-500/20' : ''}
          ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}>
          {/* Animated Border */}
          <div className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
            opacity-0 transition-opacity duration-500
            ${focused ? 'opacity-100' : ''}
          `} style={{ padding: '1px' }}>
            <div className="w-full h-full rounded-2xl bg-white" />
          </div>

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isDisabled}
            className={`
              relative w-full h-14 px-4 pt-6 pb-2
              text-gray-900 text-base font-medium
              bg-transparent border-0 outline-none
              placeholder-transparent
              transition-all duration-300
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon || loading ? 'pr-12' : ''}
              ${variant === 'minimal' ? 'h-12 pt-4' : ''}
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
                absolute left-4 pointer-events-none select-none
                font-semibold transition-all duration-300 ease-out
                ${focused || hasValue 
                  ? 'top-1.5 text-xs text-blue-600 scale-90' 
                  : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                }
                ${error ? '!text-red-500' : ''}
                ${leftIcon && !(focused || hasValue) ? 'left-12' : ''}
                ${isDisabled ? 'text-gray-400' : ''}
                ${variant === 'minimal' ? (focused || hasValue ? 'top-0' : 'top-3') : ''}
              `}
            >
              {label}
            </label>
          )}

          {/* Left Icon */}
          {leftIcon && (
            <div className={`
              absolute left-4 top-1/2 -translate-y-1/2
              transition-all duration-300
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
              absolute right-4 top-1/2 -translate-y-1/2
              transition-all duration-300
              ${focused ? 'text-blue-600 scale-110' : 'text-gray-400'}
              ${error ? '!text-red-500' : ''}
              ${isDisabled ? 'text-gray-300' : ''}
            `}>
              {loading ? (
                <div className="relative">
                  <div className="w-5 h-5 border-2 border-gray-200 rounded-full" />
                  <div className="absolute inset-0 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                rightIcon
              )}
            </div>
          )}

          {/* Shimmer Effect */}
          <div className={`
            absolute inset-0 -translate-x-full
            bg-gradient-to-r from-transparent via-white/20 to-transparent
            transition-transform duration-1000 ease-out
            ${focused ? 'translate-x-full' : ''}
          `} />
        </div>
      </div>

      {/* Helper Text / Error */}
      {(error || helperText) && (
        <div className="mt-2 px-1">
          {error ? (
            <div 
              id={`${inputId}-error`}
              className="flex items-center gap-2 text-sm font-medium text-red-600 animate-in slide-in-from-left-2 duration-300"
              role="alert"
            >
              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          ) : (
            <div 
              id={`${inputId}-helper`}
              className="text-sm text-gray-500 font-medium"
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