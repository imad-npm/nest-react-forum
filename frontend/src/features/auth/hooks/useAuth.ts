import { useSelector } from 'react-redux';
import type { RootState } from '../../../store'; // Adjust path to your root reducer if necessary

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user && !!accessToken,
  };
};
