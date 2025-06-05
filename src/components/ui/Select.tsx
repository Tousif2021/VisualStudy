import React, { useState, useRef, useEffect } from 'react';

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
            peer block w-full rounded-2xl bg-slate-50 border-2
            px-4 pt-6 pb-2 font-medium shadow-sm text-base transition
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
            appearance-none
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        >
          {/* Placeholder option */}
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
        {/* Custom dropdown arrow */}
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          ▼
        </span>
        {label && (
          <label
            htmlFor={selectId}
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
