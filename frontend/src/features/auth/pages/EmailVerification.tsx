import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import { useResendEmailVerificationMutation } from '../services/emailVerificationApiSlice';

const EmailVerification = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [resendEmail, { isLoading }] = useResendEmailVerificationMutation();
  const { showToast } = useToastContext();

  const handleResendEmail = async () => {
    try {
      await resendEmail({ email }).unwrap();
      showToast('Verification email sent successfully!', 'success');
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Unknown error';
      showToast(errorMessage, 'error');
      console.error('Failed to resend verification email: ', err);
    }
  };

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Invalid Page</h1>
          <p className="text-center">
            No email address was provided. Please register first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Email Sent Successfully</h1>
        <p className="text-center">
          A verification email has been sent to <strong>{email}</strong>.
          Please check your inbox and click the verification link to activate your account.
        </p>
        <div className="text-center">
          <p>Didn't receive the email?</p>
          <Button
            variant="link"
            onClick={handleResendEmail}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Resend email'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
