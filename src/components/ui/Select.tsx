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
  const isPlaceholderSelected = value === '' || value === undefined || value === null;

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
          bg-gradient-to-br from-white via-gray-50/80 to-white
          border border-blue-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_25px_-5px_rgba(0,0,0,0.03)]
          hover:shadow-[0_4px_6px_rgba(0,0,0,0.07),0_25px_50px_-12px_rgba(0,0,0,0.08)]
          focus:shadow-[0_0_0_3px_rgba(59,130,246,0.11),0_25px_50px_-12px_rgba(59,130,246,0.14)]
        `;
    }
  };

  // --- THE MAGIC FIX: Small, premium, floating label that doesn't overlap
  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative group mb-4`}>
      {/* Background Glow Effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 transition-opacity duration-700 pointer-events-none
        ${focused ? 'opacity-100' : ''}
        bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-emerald-400/10
        blur-lg scale-105
      `} />

      <div className="relative">
        {/* Select Container */}
        <div className={`
          relative overflow-hidden rounded-xl
          transition-all duration-300 ease-out
          ${focused ? 'scale-[1.01] ring-2 ring-blue-300' : ''}
          ${getVariantStyles()}
          ${error ? 'border-red-300 ring-2 ring-red-200' : ''}
          ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}>

          {label && (
  <label
    htmlFor={selectId}
    className={`
      ...other-classes...
      ${focused || !isPlaceholderSelected
        ? 'top-1 text-xs text-blue-600 bg-white/80'
        : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
      }
      ...other-classes...
    `}
    style={...}
  >
    {label}
  </label>
)}


          {/* Select Field */}
          <select
            id={selectId}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isDisabled}
            className={`
              relative w-full h-10 px-3 pb-1 pt-4 pr-9
              text-gray-900 text-sm font-medium
              bg-transparent border-0 outline-none
              appearance-none cursor-pointer
              transition-all duration-200
              ${variant === 'minimal' ? 'h-9 pt-4' : ''}
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
                className="py-2 text-base font-medium bg-white text-gray-900"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Icon / Loading */}
          <div className={`
            absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
            transition-all duration-300
            ${focused ? 'text-blue-600 scale-110' : 'text-gray-400 scale-100'}
            ${error ? '!text-red-500' : ''}
            ${isDisabled ? 'text-gray-300' : ''}
          `}>
            {loading ? (
              <div className="relative">
                <div className="w-4 h-4 border-2 border-gray-200 rounded-full" />
                <div className="absolute inset-0 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="drop-shadow-sm">
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
        <div className="mt-1 px-1">
          {error ? (
            <div 
              id={`${selectId}-error`}
              className="flex items-center gap-2 text-xs font-medium text-red-600 animate-in slide-in-from-left-2 duration-300"
              role="alert"
            >
              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          ) : (
            <div 
              id={`${selectId}-helper`}
              className="text-xs text-gray-500 font-medium"
            >
              {helperText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
