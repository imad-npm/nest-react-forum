import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {  useVerifyEmailChangeMutation } from '../features/settings/services/emailChangeApiSlice';

const EmailChangeVerifyPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const [skip, setSkip] = useState(true);

  // Trigger the query only when the token is available
  useEffect(() => {
    if (token) {
      setSkip(false);
    }
  }, [token]);

  const { data, isLoading, isSuccess, isError, error } =
    useVerifyEmailChangeMutation({ token: token || '' }, { skip });

  let content;
  if (isLoading) {
    content = <div>Verifying your email change...</div>;
  } else if (isSuccess) {
    content = (
      <div className="text-green-600">
        Email address updated successfully! You can now log in with your new email.
      </div>
    );
    // Optionally, you might want to log out the user or refresh their session
    // if the email change affects their current session token.
    // For now, we'll just display the message.
  } else if (isError) {
    content = (
      <div className="text-red-600">
        Error verifying email change: {(error as any)?.data?.message || 'Invalid or expired token.'}
      </div>
    );
  } else {
    content = <div className="text-red-600">No verification token found.</div>;
  }

  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Email Change Verification</h1>
      {content}
    </div>
  );
};

export default EmailChangeVerifyPage;
