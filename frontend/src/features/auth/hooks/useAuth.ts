import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../shared/stores/store';
import { useLoginMutation, useGetMeQuery } from '../services/authApi';
import type { LoginDto } from '../types';

export const useAuth = () => {
  const { data, isLoading: isUserLoading, error: userError } = useGetMeQuery();
  const user = data?.data;

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

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
    isUserLoading,
    userError,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    handleLogin,
    isLoggingIn: isLoading,
    loginError: error,
  };
};
