import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastTypeClasses: Record<ToastType, string> = {
  success: 'bg-green-500/90',
  error: 'bg-red-500/90',
  info: 'bg-blue-500/90',
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-toast">
      <div
        className={`
          px-6 py-3 rounded-full text-sm font-medium text-white
          shadow-lg backdrop-blur
          ${toastTypeClasses[type]}
        `}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;
