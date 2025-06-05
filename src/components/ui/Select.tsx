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
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-4`}>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            peer w-full rounded-t-md rounded-b-none px-3 pt-6 pb-2
            text-gray-900 text-base
            border-0 border-b-2 border-gray-300
            bg-gray-50/50
            transition-all duration-200
            focus:outline-none focus:border-blue-500 focus:ring-0
            appearance-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="\" disabled hidden>
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

        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>

        <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
          <div className={`
            absolute inset-0 w-full h-full bg-blue-500 transform origin-left scale-x-0 transition-transform duration-200
            ${focused ? 'scale-x-100' : ''}
            ${error ? 'bg-red-500' : ''}
          `} />
        </div>
      </div>

      {(error || helperText) && (
        <div className="mt-1 text-xs min-h-[1.25rem]">
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