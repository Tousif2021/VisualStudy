import React, { useState, useEffect } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showCounter?: boolean;
  maxLength?: number;
  loading?: boolean;
  autoResize?: boolean;
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
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  const isDisabled = disabled || loading;

  useEffect(() => {
    setHasValue(Boolean(value && String(value).length > 0));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    onChange?.(e);
  };

  const characterCount = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;
  const isAtLimit = maxLength && characterCount >= maxLength;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative group`}>
      <div className="relative">
        {/* Textarea Field */}
        <textarea
          id={textareaId}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          maxLength={maxLength}
          disabled={isDisabled}
          className={`
            peer w-full px-5 pt-7 pb-4
            text-gray-900 text-base font-medium leading-relaxed tracking-wide
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
            resize-none
            placeholder-transparent
            disabled:bg-gray-50/80 
            disabled:cursor-not-allowed 
            disabled:border-gray-200/50
            disabled:text-gray-400
            disabled:shadow-none
            ${autoResize ? 'overflow-hidden' : 'overflow-auto'}
            ${error ? 'border-red-400/80 focus:border-red-500/80 focus:shadow-red-500/20 bg-red-50/30' : ''}
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
              absolute left-5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none
              font-semibold tracking-wide select-none
              ${focused || hasValue 
                ? 'top-2.5 text-xs text-gray-600 scale-95' 
                : 'top-5 text-base text-gray-500 scale-100'
              }
              ${focused ? 'text-blue-600' : ''}
              ${error ? '!text-red-600' : ''}
              ${isDisabled ? 'text-gray-400' : ''}
            `}
          >
            {label}
          </label>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute right-5 top-5">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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

      {/* Footer: Helper Text + Character Counter */}
      {(error || helperText || showCounter) && (
        <div className="mt-3 px-5 flex justify-between items-start gap-4">
          <div className="flex-1">
            {error ? (
              <div 
                id={`${textareaId}-error`}
                className="flex items-center gap-2 text-sm font-medium text-red-600"
                role="alert"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            ) : helperText ? (
              <div 
                id={`${textareaId}-helper`}
                className="text-sm text-gray-600 font-medium"
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
                text-sm font-semibold tabular-nums flex-shrink-0
                transition-colors duration-300
                ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-500' : 'text-gray-500'}
              `}
              aria-live="polite"
            >
              <span className={isAtLimit ? 'animate-pulse' : ''}>
                {characterCount}
              </span>
              <span className="text-gray-400">/{maxLength}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};