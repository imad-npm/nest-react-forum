import React from 'react';

export type ButtonVariant = 'default' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonClasses {
  base?: string;
  variant?: Partial<Record<ButtonVariant, string>>;
  size?: Partial<Record<ButtonSize, string>>;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  classes?: ButtonClasses;
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      variant = 'default',
      size = 'md',
      classes = {},
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      classes.base,
      classes.variant?.[variant],
      classes.size?.[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
