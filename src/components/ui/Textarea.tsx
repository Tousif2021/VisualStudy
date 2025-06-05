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
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  const hasValue = typeof value === 'string' && value.length > 0;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-2`}>
      <div className="relative">
        <textarea
          id={textareaId}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
          maxLength={maxLength}
          className={`
            peer w-full rounded bg-slate-50 border px-2 py-1 text-xs font-medium shadow-sm transition
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
            placeholder-transparent resize-none
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
              pointer-events-none absolute left-2 top-0.5 text-gray-500 bg-slate-50 px-1 rounded
              transition-all duration-200
              peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs peer-placeholder-shown:text-gray-400
              peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-blue-500
              ${focused || hasValue ? '-top-2 text-[10px] text-blue-500' : 'top-2 text-xs'}
            `}
            style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}
          >
            {label}
          </label>
        )}
      </div>
      <div className="flex items-center justify-between mt-0.5 min-h-[1rem]">
        {error
          ? <span className="text-[10px] text-red-500">{error}</span>
          : helperText
          ? <span className="text-[10px] text-gray-500">{helperText}</span>
          : null}
        {showCounter && typeof value === 'string' && maxLength && (
          <span className={`text-[10px] ${value.length === maxLength ? 'text-red-500' : 'text-gray-400'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
