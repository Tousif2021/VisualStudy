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
  placeholder = 'Select an option',
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
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-6`}>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            peer w-full h-14 px-4 pt-6 pb-2 pr-12
            text-gray-900 text-base font-medium
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
            appearance-none
            cursor-pointer
            disabled:bg-gray-50/80 
            disabled:cursor-not-allowed 
            disabled:border-gray-200/40
            disabled:text-gray-400
            ${error ? 'border-red-400/60 focus:border-red-500/60 focus:shadow-red-500/10' : ''}
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
            <option key={option.value} value={option.value} className="py-2">
              {option.label}
            </option>
          ))}
        </select>

        {label && (
          <label
            htmlFor={selectId}
            className={`
              absolute left-4 transition-all duration-300 ease-out pointer-events-none
              font-medium tracking-wide
              ${focused || hasValue 
                ? 'top-2 text-xs text-gray-500' 
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
              }
              ${focused ? 'text-blue-600' : ''}
              ${error ? '!text-red-500' : ''}
            `}
          >
            {label}
          </label>
        )}

        <span className={`
          absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none 
          transition-all duration-300 ease-out
          ${focused ? 'text-blue-600 rotate-180' : 'text-gray-400'}
          ${error ? '!text-red-500' : ''}
        `}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M4 6L8 10L12 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {(error || helperText) && (
        <div className="mt-2 px-4 text-sm min-h-[1.25rem]">
          {error ? (
            <span className="text-red-500 font-medium">{error}</span>
          ) : (
            <span className="text-gray-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
};