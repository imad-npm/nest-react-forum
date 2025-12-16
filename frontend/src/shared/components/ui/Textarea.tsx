import React, { useRef, useLayoutEffect, useEffect } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
  maxHeight?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  className = '',
  minHeight = 40, // Default minimum height
  maxHeight = 200, // Default maximum height
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit'; // Reset height to recalculate
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [props.value, minHeight, maxHeight]); // Re-adjust height if value or height bounds change

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => adjustHeight());
    resizeObserver.observe(element);

    // Observe parent element for changes that might affect textarea's layout
    if (element.parentElement) {
      resizeObserver.observe(element.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [minHeight, maxHeight]);

  const classes = `
    block w-full px-3 py-2 border border-gray-300 rounded-md
    shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-blue-500 focus:border-blue-500
    sm:text-sm resize-none overflow-hidden
    ${props.disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <textarea
      ref={textareaRef}
      className={classes}
      {...props}
      onInput={adjustHeight} // Adjust height on user input
    />
  );
};
