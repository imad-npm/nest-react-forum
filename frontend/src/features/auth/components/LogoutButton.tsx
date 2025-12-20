import { useAppDispatch } from '../../../shared/stores/hooks';
import { logout } from '../stores/authSlice';
import { FaSignOutAlt } from 'react-icons/fa';
import { Button } from '../../../shared/components/ui/Button'; // Assuming you have a Button component

interface LogoutButtonProps {
  className?: string; // Add className prop
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Button onClick={handleLogout} variant="ghost" className={`flex items-center space-x-1 ${className}`}>
      <FaSignOutAlt /> <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
