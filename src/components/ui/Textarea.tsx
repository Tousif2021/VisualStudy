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
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-4`}>
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
            peer w-full rounded-t-md rounded-b-none px-3 pt-6 pb-2
            text-gray-900 text-base
            border-0 border-b-2 border-gray-300
            bg-gray-50/50
            transition-all duration-200
            focus:outline-none focus:border-blue-500 focus:ring-0
            resize-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          placeholder={label || props.placeholder || ' '}
          {...props}
        />

        {label && (
          <label
            htmlFor={textareaId}
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

        <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
          <div className={`
            absolute inset-0 w-full h-full bg-blue-500 transform origin-left scale-x-0 transition-transform duration-200
            ${focused ? 'scale-x-100' : ''}
            ${error ? 'bg-red-500' : ''}
          `} />
        </div>
      </div>

      <div className="mt-1 flex justify-between items-center min-h-[1.25rem] text-xs">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          <span className="text-gray-500">{helperText}</span>
        )}
        {showCounter && typeof value === 'string' && maxLength && (
          <span className={`text-right ${value.length === maxLength ? 'text-red-500' : 'text-gray-500'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};