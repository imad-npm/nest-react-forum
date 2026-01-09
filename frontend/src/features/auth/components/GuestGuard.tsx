import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard prevents authenticated users from accessing guest-only routes
 * (e.g., Login, Register). If the user is logged in, they are redirected.
 */
export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

 

  // If user is authenticated, redirect them away from guest pages
  if (accessToken) {
    // Redirect to the home page or the page they were trying to access before
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};