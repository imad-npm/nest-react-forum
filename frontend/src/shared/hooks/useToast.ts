import { useState, useCallback } from 'react';
import type { ToastType } from '../components/ui/Toast';

export interface ToastData {
  message: string;
  type: ToastType;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
