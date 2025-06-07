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
  onChange,
  className = '',
  id,
  placeholder = 'Select an option',
  value,
  disabled,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  const hasValue = value !== undefined && value !== '';
  const isDisabled = disabled || loading;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} relative group`}>
      <div className="relative">
        {/* Select Field */}
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={isDisabled}
          className={`
            peer w-full h-16 px-5 pt-7 pb-3 pr-14
            text-gray-900 text-base font-medium tracking-wide
            bg-white/95 backdrop-blur-xl
            border-2 border-gray-200/80
            rounded-3xl
            shadow-sm shadow-gray-900/5
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            focus:outline-none 
            focus:border-blue-500/80 
            focus:shadow-2xl 
            focus:shadow-blue-500/20
            focus:bg-white
            focus:scale-[1.02]
            hover:border-gray-300/90
            hover:shadow-lg
            hover:shadow-gray-900/10
            appearance-none
            cursor-pointer
            disabled:bg-gray-50/80 
            disabled:cursor-not-allowed 
            disabled:border-gray-200/50
            disabled:text-gray-400
            disabled:shadow-none
            ${error ? 'border-red-400/80 focus:border-red-500/80 focus:shadow-red-500/20 bg-red-50/30' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
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
              className="py-3 text-base font-medium"
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Floating Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={`
              absolute left-5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none
              font-semibold tracking-wide select-none
              ${focused || hasValue 
                ? 'top-2.5 text-xs text-gray-600 scale-95' 
                : 'top-1/2 -translate-y-1/2 text-base text-gray-500 scale-100'
              }
              ${focused ? 'text-blue-600' : ''}
              ${error ? '!text-red-600' : ''}
              ${isDisabled ? 'text-gray-400' : ''}
            `}
          >
            {label}
          </label>
        )}

        {/* Dropdown Icon / Loading */}
        <div className={`
          absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none 
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${focused ? 'text-blue-600 rotate-180 scale-110' : 'text-gray-500 rotate-0 scale-100'}
          ${error ? '!text-red-600' : ''}
          ${isDisabled ? 'text-gray-400' : ''}
        `}>
          {loading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M5 7.5L10 12.5L15 7.5" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Focus Ring */}
        <div className={`
          absolute inset-0 rounded-3xl pointer-events-none
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${focused ? 'ring-4 ring-blue-500/20 scale-105' : 'ring-0 scale-100'}
          ${error ? 'ring-red-500/20' : ''}
        `} />
      </div>

      {/* Helper Text / Error */}
      {(error || helperText) && (
        <div className="mt-3 px-5">
          {error ? (
            <div 
              id={`${selectId}-error`}
              className="flex items-center gap-2 text-sm font-medium text-red-600"
              role="alert"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          ) : (
            <div 
              id={`${selectId}-helper`}
              className="text-sm text-gray-600 font-medium"
            >
              {helperText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};