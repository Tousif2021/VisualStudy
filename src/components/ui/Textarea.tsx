import React, { useState, useEffect, useRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showCounter?: boolean;
  maxLength?: number;
  loading?: boolean;
  autoResize?: boolean;
  variant?: 'default' | 'glass' | 'minimal';
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  showCounter = false,
  maxLength,
  loading = false,
  autoResize = false,
  variant = 'default',
  value,
  onChange,
  className = '',
  id,
  rows = 4,
  disabled,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  const isDisabled = disabled || loading;

  useEffect(() => {
    setHasValue(Boolean(value && String(value).length > 0));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    onChange?.(e);
  };

  const characterCount = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;
  const isAtLimit = maxLength && characterCount >= maxLength;

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return `
          bg-white/10 backdrop-blur-2xl border border-white/20
          shadow-[0_8px_32px_rgba(0,0,0,0.1)] 
          hover:bg-white/15 hover:border-white/30
          focus:bg-white/20 focus:border-purple-400/50
        `;
      case 'minimal':
        return `
          bg-transparent border-0 border-b-2 border-gray-200 rounded-none
          shadow-none hover:border-gray-300
          focus:border-purple-500 focus:shadow-none
        `;
      default:
        return `
          bg-gradient-to-br from-white via-gray-50/50 to-white
          border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_-5px_rgba(0,0,0,0.04)]
          hover:shadow-[0_4px_6px_rgba(0,0,0,0.05),0_25px_50px_-12px_rgba(0,0,0,0.08)]
          focus:shadow-[0_0_0_3px_rgba(147,51,234,0.1),0_25px_50px_-12px_rgba(147,51,234,0.15)]
        `;
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative group mb-6`}>
      {/* Background Glow Effect */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700
        ${focused ? 'opacity-100' : ''}
        bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10
        blur-xl scale-110
      `} />

      <div className="relative">
        {/* Textarea Container */}
        <div className={`
          relative overflow-hidden rounded-2xl
          transition-all duration-500 ease-out
          ${focused ? 'scale-[1.01] rotate-[0.1deg]' : 'scale-100 rotate-0'}
          ${getVariantStyles()}
          ${error ? 'border-red-300 shadow-red-500/20' : ''}
          ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}>
          {/* Animated Border */}
          <div className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500
            opacity-0 transition-opacity duration-500
            ${focused ? 'opacity-100' : ''}
          `} style={{ padding: '1px' }}>
            <div className="w-full h-full rounded-2xl bg-white" />
          </div>

          {/* Textarea Field */}
          <textarea
            ref={textareaRef}
            id={textareaId}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={rows}
            maxLength={maxLength}
            disabled={isDisabled}
            className={`
              relative w-full px-4 pt-7 pb-4
              text-gray-900 text-base font-medium leading-relaxed
              bg-transparent border-0 outline-none
              resize-none placeholder-transparent
              transition-all duration-300
              ${autoResize ? 'overflow-hidden' : 'overflow-auto'}
              ${variant === 'minimal' ? 'pt-5' : ''}
              ${className}
            `}
            placeholder={label || props.placeholder || ' '}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              [
                error ? `${textareaId}-error` : '',
                helperText ? `${textareaId}-helper` : '',
                showCounter ? `${textareaId}-counter` : ''
              ].filter(Boolean).join(' ') || undefined
            }
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label
              htmlFor={textareaId}
              className={`
                absolute left-4 pointer-events-none select-none
                font-semibold transition-all duration-300 ease-out
                ${focused || hasValue 
                  ? 'top-1.5 text-xs text-purple-600 scale-90' 
                  : 'top-4 text-base text-gray-500'
                }
                ${error ? '!text-red-500' : ''}
                ${isDisabled ? 'text-gray-400' : ''}
                ${variant === 'minimal' ? (focused || hasValue ? 'top-0' : 'top-2') : ''}
              `}
            >
              {label}
            </label>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute right-4 top-4">
              <div className="relative">
                <div className="w-5 h-5 border-2 border-gray-200 rounded-full" />
                <div className="absolute inset-0 w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
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

      {/* Footer: Helper Text + Character Counter */}
      {(error || helperText || showCounter) && (
        <div className="mt-2 px-1 flex justify-between items-start gap-4">
          <div className="flex-1">
            {error ? (
              <div 
                id={`${textareaId}-error`}
                className="flex items-center gap-2 text-sm font-medium text-red-600 animate-in slide-in-from-left-2 duration-300"
                role="alert"
              >
                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            ) : helperText ? (
              <div 
                id={`${textareaId}-helper`}
                className="text-sm text-gray-500 font-medium"
              >
                {helperText}
              </div>
            ) : null}
          </div>

          {/* Character Counter */}
          {showCounter && maxLength && (
            <div 
              id={`${textareaId}-counter`}
              className={`
                text-sm font-bold tabular-nums flex-shrink-0
                px-2 py-1 rounded-full transition-all duration-300
                ${isAtLimit 
                  ? 'text-white bg-red-500 animate-pulse scale-110' 
                  : isNearLimit 
                  ? 'text-orange-600 bg-orange-100' 
                  : 'text-gray-500 bg-gray-100'
                }
              `}
              aria-live="polite"
            >
              {characterCount}/{maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  );
};