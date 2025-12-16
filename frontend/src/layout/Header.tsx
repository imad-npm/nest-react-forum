import { Link } from 'react-router-dom';
import { useAppSelector } from '../shared/stores/hooks';
import LogoutButton from '../features/auth/components/LogoutButton';
import { FaHome, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa'; // Import icons

const Header = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
          <FaHome className="inline-block" /> <span>Forum</span>
        </Link>
        <ul className="flex space-x-4">
          {accessToken ? (
            <li>
              <LogoutButton />
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="flex items-center space-x-1 hover:text-gray-300">
                  <FaSignInAlt /> <span>Login</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="flex items-center space-x-1 hover:text-gray-300">
                  <FaUserPlus /> <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
