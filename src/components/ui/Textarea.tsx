import React, { useState } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showCounter?: boolean;
  maxLength?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  showCounter = false,
  maxLength,
  value,
  onChange,
  className = '',
  id,
  rows = 4,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  const hasValue = typeof value === 'string' && value.length > 0;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-6`}>
      <div className="relative">
        <textarea
          id={textareaId}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          maxLength={maxLength}
          className={`
            peer w-full px-4 pt-6 pb-3
            text-gray-900 text-base font-medium leading-relaxed
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
            resize-none
            disabled:bg-gray-50/80 
            disabled:cursor-not-allowed 
            disabled:border-gray-200/40
            disabled:text-gray-400
            placeholder-transparent
            ${error ? 'border-red-400/60 focus:border-red-500/60 focus:shadow-red-500/10' : ''}
            ${className}
          `}
          placeholder={label || props.placeholder || ' '}
          {...props}
        />

        {label && (
          <label
            htmlFor={textareaId}
            className={`
              absolute left-4 transition-all duration-300 ease-out pointer-events-none
              font-medium tracking-wide
              ${focused || hasValue 
                ? 'top-2 text-xs text-gray-500' 
                : 'top-4 text-base text-gray-400'
              }
              ${focused ? 'text-blue-600' : ''}
              ${error ? '!text-red-500' : ''}
            `}
          >
            {label}
          </label>
        )}
      </div>

      <div className="mt-2 px-4 flex justify-between items-center min-h-[1.25rem] text-sm">
        {error ? (
          <span className="text-red-500 font-medium">{error}</span>
        ) : (
          <span className="text-gray-500">{helperText}</span>
        )}
        {showCounter && typeof value === 'string' && maxLength && (
          <span className={`
            font-medium transition-colors duration-300
            ${value.length === maxLength ? 'text-red-500' : 'text-gray-400'}
            ${value.length > maxLength * 0.8 ? 'text-orange-500' : ''}
          `}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};