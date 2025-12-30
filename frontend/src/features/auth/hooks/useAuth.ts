import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../shared/stores/store';
import { useLoginMutation } from '../services/authApi';
import type { LoginDto } from '../types';

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginDto) => {
    try {
      await login(data).unwrap();
      navigate('/');
    } catch (err: any) {
      console.error('Failed to login: ', err);
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user && !!accessToken,
    handleLogin,
    isLoggingIn: isLoading,
    loginError: error,
  };
};
