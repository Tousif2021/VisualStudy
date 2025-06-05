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
  fullWidth,
  leftIcon,
  rightIcon,
  className = '',
  id,
  value,
  ...props
}) => {
  const [focus, setFocus] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  const hasValue = typeof value === 'string' && value.length > 0;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-4`}>
      <div className="relative">
        <input
          id={inputId}
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={label ? ' ' : props.placeholder}
          className={`
            peer w-full rounded-2xl bg-slate-50 border-2 px-4 pt-6 pb-2 font-medium shadow-sm text-base
            transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 placeholder-transparent
            ${leftIcon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''}
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{leftIcon}</span>
        )}
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{rightIcon}</span>
        )}
        {label && (
          <label
            htmlFor={inputId}
            className={`
              pointer-events-none absolute left-4 top-3 bg-slate-50 px-1 text-gray-500 rounded
              transition-all duration-200
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
              ${focus || hasValue ? '-top-2 text-xs text-blue-500' : 'top-5 text-base'}
            `}
            style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}
          >{label}</label>
        )}
      </div>
      <div className="mt-1 min-h-[1.25rem] text-xs">
        {error
          ? <span className="text-red-500">{error}</span>
          : helperText
          ? <span className="text-gray-500">{helperText}</span>
          : null}
      </div>
    </div>
  );
};
