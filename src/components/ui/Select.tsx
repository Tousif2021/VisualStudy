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
    <div className={`${fullWidth ? 'w-full' : ''} relative mb-2`}>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            peer block w-full rounded bg-slate-50 border
            px-2 py-1 text-xs font-medium shadow-sm transition
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
            appearance-none
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
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
        {/* Custom small chevron */}
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="10" height="10" fill="none" viewBox="0 0 20 20">
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        {label && (
          <label
            htmlFor={selectId}
            className={`
              pointer-events-none absolute left-2 top-0.5 text-gray-500 bg-slate-50 px-1 rounded
              transition-all duration-200
              ${focused || hasValue ? '-top-2 text-[10px] text-blue-500' : 'top-2 text-xs text-gray-400'}
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
      </div>
    </div>
  );
};
