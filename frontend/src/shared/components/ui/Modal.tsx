import React, { useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  disableBackgroundClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  disableBackgroundClose = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!disableBackgroundClose && modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose, disableBackgroundClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

