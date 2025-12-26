import React from 'react';
import { createPortal } from 'react-dom';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'; // added xl

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
    'fixed inset-0 z-[999] flex items-center justify-center bg-black/40',
  container:
    'bg-white rounded-xl shadow-xl w-full mx-4',
  size: {
    sm: 'max-w-sm p-4',
    md: 'max-w-lg p-6',
    lg: 'max-w-2xl p-8',
    xl: 'max-w-4xl p-10', // added xl size
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

  return createPortal(
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
    </div>,document.body
  );
};
