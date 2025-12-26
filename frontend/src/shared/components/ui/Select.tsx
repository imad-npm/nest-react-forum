import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  className?: string;
  id?: string; // if you need id
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ options, placeholder = 'Select...', value, onChange, className }, ref) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find((o) => o.value === value)?.label;

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (ref && typeof ref === 'function') ref(node);
          else if (ref && 'current' in ref) ref.current = node;
        }}
        className={`relative w-full ${className}`}
      >
        {/* Button */}
        <button
          type="button"
          className="w-full text-left bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={selectedLabel ? '' : 'text-gray-400'}>
            {selectedLabel || placeholder}
          </span>
          {/* Arrow */}
          <svg
            className={`w-4 h-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto text-sm">
            {options.map((option) => (
              <li
                key={String(option.value)}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${option.disabled ? 'text-gray-400 cursor-not-allowed' : ''
                  }`}
                onClick={() => {
                  if (!option.disabled && onChange) {
                    onChange(option.value); // use option.value directly
                    setOpen(false);
                  }
                }}

              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
