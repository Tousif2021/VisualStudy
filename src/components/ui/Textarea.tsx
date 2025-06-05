import React, { useState, useRef, useEffect } from 'react';

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
  className = '',
  id,
  showCounter = false,
  maxLength,
  value,
  onChange,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  const hasValue = typeof value === 'string' ? value.length > 0 : false;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-3`}>
      <div className="relative">
        <textarea
          id={textareaId}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
          maxLength={maxLength}
          className={`
            peer resize-none w-full rounded-lg bg-slate-50 border px-3 py-2 text-sm font-medium shadow-sm transition
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
            placeholder-transparent
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
            ${className}
          `}
          placeholder={label ? ' ' : props.placeholder}
          {...props}
        />
        {label && (
          <label
            htmlFor={textareaId}
            className={`
              pointer-events-none absolute left-3 top-2 text-gray-500 bg-slate-50 px-1 rounded
              transition-all duration-200
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
              ${focused || hasValue ? '-top-2 text-xs text-blue-500' : 'top-4 text-sm'}
            `}
            style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}
          >
            {label}
          </label>
        )}
      </div>
      <div className="flex items-center justify-between mt-1 min-h-[1.25rem]">
        {error ? (
          <span className="text-xs text-red-500">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-500">{helperText}</span>
        ) : null}
        {showCounter && typeof value === 'string' && maxLength && (
          <span className={`text-xs ${value.length === maxLength ? 'text-red-500' : 'text-gray-400'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
