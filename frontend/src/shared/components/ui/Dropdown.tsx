import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  width?: '48';
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'right',
  width = '48',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const alignmentClasses = align === 'left' ? 'origin-top-left left-0' : 'origin-top-right right-0';
  const widthClasses = width === '48' ? 'w-48' : '';

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleOpen}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
          onClick={close}
        >
          <div className="rounded-md ring-1 ring-gray-300  ring-opacity-5 bg-white dark:bg-gray-700">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
