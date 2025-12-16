import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const getVariantClasses = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 hover:bg-blue-700 text-white';
    case 'secondary':
      return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white';
    case 'ghost':
      return 'bg-transparent hover:bg-gray-100 text-gray-800';
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white';
  }
};

const getSizeClasses = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1 text-sm';
    case 'md':
      return 'px-4 py-2 text-base';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return 'px-4 py-2 text-base';
  }
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const classes = `
    font-medium rounded-md transition duration-150 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${getVariantClasses(variant)}
    ${getSizeClasses(size)}
    ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
