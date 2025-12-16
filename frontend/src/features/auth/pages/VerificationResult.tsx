import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToastContext } from '../../../shared/providers/ToastProvider';

const VerificationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const error = params.get('error');
    const message =params.get('message') ?? ''
    if (success) {
      showToast(message, 'success');
    } else if (error) {
      showToast(message, 'error');
    }

    navigate('/login');
  }, [location, navigate, showToast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Verifying your email...</h1>
      </div>
    </div>
  );
};

export default VerificationResult;
