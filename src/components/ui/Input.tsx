import React, { useState, useRef, useEffect } from 'react';

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
  const hasValue = typeof value === 'string' ? value.length > 0 : false;

  // Compose focus handlers if user passed them in
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-4`}>
      <div className="relative">
        <input
          id={inputId}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            peer block w-full rounded-2xl bg-slate-50 border-2
            px-4 pt-6 pb-2 font-medium shadow-sm text-base transition
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
            placeholder-transparent
            ${leftIcon ? 'pl-11' : ''}
            ${rightIcon ? 'pr-11' : ''}
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
            ${className}
          `}
          placeholder={label ? ' ' : props.placeholder}
          {...props}
        />
        {/* Left icon */}
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        {/* Right icon */}
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 pointer-events-none">
            {rightIcon}
          </span>
        )}
        {label && (
          <label
            htmlFor={inputId}
            className={`
              pointer-events-none absolute left-4 top-3
              text-gray-500 transition-all duration-200
              bg-slate-50 px-1
              peer-placeholder-shown:top-5
              peer-placeholder-shown:text-base
              peer-placeholder-shown:text-gray-400
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
              ${focused || hasValue ? '-top-2 text-xs text-blue-500' : 'top-5 text-base'}
              rounded
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
        ) : <span />}
      </div>
    </div>
  );
};
