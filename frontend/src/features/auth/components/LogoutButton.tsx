import { useAppDispatch } from '../../../shared/stores/hooks';
import { logout } from '../stores/authSlice';

const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
