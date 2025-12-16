import React from 'react';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalClasses {
  backdrop?: string;
  container?: string;
  size?: Partial<Record<ModalSize, string>>;
}

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  size?: ModalSize;
  classes?: ModalClasses;
  children: React.ReactNode;
}

const DEFAULT_CLASSES: Required<ModalClasses> = {
  backdrop:
    'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm',
  container:
    'bg-white rounded-xl shadow-xl w-full mx-4',
  size: {
    sm: 'max-w-sm p-4',
    md: 'max-w-lg p-6',
    lg: 'max-w-2xl p-8',
  },
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'md',
  classes = {},
  children,
}) => {
  if (!open) return null;

  const backdropClass = [
    DEFAULT_CLASSES.backdrop,
    classes.backdrop,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClass = [
    DEFAULT_CLASSES.container,
    DEFAULT_CLASSES.size[size],
    classes.container,
    classes.size?.[size],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={backdropClass}
      onClick={onClose}
    >
      <div
        className={containerClass}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
