import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any specific props here if needed, beyond standard HTML input attributes
}

export  const Input: React.FC<InputProps> = ({
  className = '',
  ...props
}) => {
  const classes = `
    block w-full px-3 py-2 border border-gray-300 rounded-md
    shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-blue-500 focus:border-blue-500
    sm:text-sm
    ${props.disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <input
      className={classes}
      {...props}
    />
  );
};
