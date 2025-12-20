import React from 'react';

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link' | 'icon';
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
    const defaultClasses = {
      base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
      variant: {
        default: 'bg-primary-600 text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary-600 text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary-600',
        icon: 'h-10 w-10',
      },
      size: {
        sm: 'h-9 px-3 rounded-md',
        md: 'h-10 py-2 px-4',
        lg: 'h-11 px-8 rounded-md',
      },
    };

    const classNames = [
      defaultClasses.base,
      defaultClasses.variant[variant],
      defaultClasses.size[size],
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
