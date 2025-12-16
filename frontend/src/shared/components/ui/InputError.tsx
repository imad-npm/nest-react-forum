import React from 'react';

export interface InputErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export const InputError = React.forwardRef<
  HTMLParagraphElement,
  InputErrorProps
>(({ message, className = '', ...props }, ref) => {
  if (!message) {
    return null;
  }
  return (
    <p
      ref={ref}
      className={`text-sm text-red-500 ${className}`}
      {...props}
    >
      {message}
    </p>
  );
});

InputError.displayName = 'InputError';
