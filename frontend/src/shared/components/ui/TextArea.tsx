import React from 'react';

export interface TextareaClasses {
  base?: string;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  classes?: TextareaClasses;
}

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      classes = {},
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      // ✅ Tailwind default style
      'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
      'placeholder-gray-400 ',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'resize-y',

      // ✅ overrides
      classes.base,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <textarea
        ref={ref}
        className={classNames}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
