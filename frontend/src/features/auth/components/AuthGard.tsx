import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../../../shared/stores/store';
import type { JSX } from 'react';

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
