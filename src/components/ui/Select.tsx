import React, { useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  placeholder?: string;
  loading?: boolean;
  variant?: 'default' | 'glass' | 'minimal';
  onChange?: (value: string) => void;
  value?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  fullWidth = false,
  loading = false,
  variant = 'default',
  onChange,
  className = '',
  id,
  placeholder = 'Choose an option',
  value,
  disabled,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  const hasValue = value !== undefined && value !== '' && value !== null;
  const isDisabled = disabled || loading;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return `
          bg-white/30 backdrop-blur-lg border border-blue-200
          shadow-[0_4px_24px_rgba(45,77,253,0.05)]
          hover:bg-white/40 hover:border-blue-400
          focus:bg-white/50 focus:border-blue-500
        `;
      case 'minimal':
        return `
          bg-transparent border-0 border-b-2 border-gray-200 rounded-none
          shadow-none hover:border-gray-300
          focus:border-blue-500 focus:shadow-none
        `;
      default:
        return `
          bg-white border border-gray-300
          shadow-sm
          hover:border-gray-400 hover:shadow-md
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
        `;
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-4`}>
      {/* Label - Always visible above the select */}
      {label && (
        <label
          htmlFor={selectId}
          className={`
            block text-sm font-medium mb-2
            ${error ? 'text-red-600' : 'text-gray-700'}
            ${isDisabled ? 'text-gray-400' : ''}
          `}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Select Container */}
        <div className={`
          relative rounded-lg
          transition-all duration-200 ease-out
          ${getVariantStyles()}
          ${error ? 'border-red-300 ring-2 ring-red-200' : ''}
          ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}>
          {/* Select Field */}
          <select
            id={selectId}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isDisabled}
            className={`
              w-full h-10 px-3 pr-10
              text-gray-900 text-sm
              bg-transparent border-0 outline-none
              appearance-none cursor-pointer
              transition-all duration-200
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value} 
                disabled={option.disabled}
                className="py-2 text-sm bg-white text-gray-900"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Icon / Loading */}
          <div className={`
            absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
            transition-all duration-200
            ${focused ? 'text-blue-600' : 'text-gray-400'}
            ${error ? '!text-red-500' : ''}
            ${isDisabled ? 'text-gray-300' : ''}
          `}>
            {loading ? (
              <div className="relative">
                <div className="w-4 h-4 border-2 border-gray-200 rounded-full" />
                <div className="absolute inset-0 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path 
                  d="M6 8L10 12L14 8" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Helper Text / Error */}
      {(error || helperText) && (
        <div className="mt-1">
          {error ? (
            <div 
              id={`${selectId}-error`}
              className="text-xs text-red-600"
              role="alert"
            >
              {error}
            </div>
          ) : (
            <div 
              id={`${selectId}-helper`}
              className="text-xs text-gray-500"
            >
              {helperText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};