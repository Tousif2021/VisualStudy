import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  id,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const hasValue = typeof value === 'string' && value.length > 0;

  // Smart focus handlers
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-2`}>
      <div className="relative">
        <input
          id={inputId}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={label ? ' ' : props.placeholder}
          className={`
            peer block w-full rounded bg-slate-50 border
            px-2 py-1 text-xs font-medium shadow-sm transition
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
            placeholder-transparent
            ${leftIcon ? 'pl-8' : ''}
            ${rightIcon ? 'pr-8' : ''}
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {leftIcon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        {rightIcon && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {rightIcon}
          </span>
        )}
        {label && (
          <label
            htmlFor={inputId}
            className={`
              pointer-events-none absolute left-2 top-0.5
              text-gray-500 bg-slate-50 px-1 rounded
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
          : null
        }
      </div>
    </div>
  );
};
