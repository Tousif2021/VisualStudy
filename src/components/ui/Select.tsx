import React, { useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  fullWidth = false,
  onChange,
  className = '',
  id,
  placeholder = 'Select...',
  value,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  const hasValue = value !== undefined && value !== '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-4 group`}>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            peer w-full px-4 h-12
            text-gray-900 text-base
            bg-white rounded-xl
            border-2 border-gray-200
            shadow-sm
            transition-all duration-200
            focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
            appearance-none
            disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-200
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {label && (
          <label
            htmlFor={selectId}
            className={`
              absolute left-2 px-2 transition-all duration-200 pointer-events-none
              ${focused || hasValue 
                ? '-top-2.5 text-sm bg-white'
                : 'top-3.5 text-base bg-transparent'
              }
              ${focused ? 'text-blue-500' : 'text-gray-500'}
              ${error ? '!text-red-500' : ''}
            `}
          >
            {label}
          </label>
        )}

        <span className={`
          absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200
          ${focused ? 'text-blue-500' : 'text-gray-400'}
          ${error ? '!text-red-500' : ''}
        `}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {(error || helperText) && (
        <div className="mt-1.5 px-4 text-xs min-h-[1.25rem]">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <span className="text-gray-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
};