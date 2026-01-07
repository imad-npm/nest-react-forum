import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useProfile } from '../features/profile/hooks/useProfile';
import LogoutButton from '../features/auth/components/LogoutButton';
import SearchBar from '../features/search/components/SearchBar';
import { FaHome, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaPlus, FaCaretDown, FaUserCircle } from 'react-icons/fa';
import NotificationsBell from '../features/notifications/components/NotificationsBell';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const profile = useProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className=" p-4 border-b sticky top-0 border-gray-300">
      <nav className="container mx-auto  flex justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2 flex-shrink-0">
          <FaHome className="inline-block" /> <span>Forum</span>
        </Link>
        <div className="flex-grow max-w-xl">
          <SearchBar />
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Create Post Button */}
              <Link to="/submit" className="flex items-center space-x-1 hover:text-gray-300">
                <FaPlus /> <span>Create Post</span>
              </Link>

              {/* Notification Bell */}
              <NotificationsBell />

              {/* User Profile Dropdown */}
              <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center space-x-2 hover:text-gray-300 focus:outline-none">
                  {profile?.picture ? (
                    <img
                      src={profile.picture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl" />
                  )}
                  <FaCaretDown />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 text-gray-800 dark:text-gray-200 z-10">
                    <Link
                      to={user ? `/profile/${user.id}` : ''}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Profile (@{profile?.displayName})
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    <LogoutButton className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600" />
                  </div>
                )}
              </div>
            </>
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
