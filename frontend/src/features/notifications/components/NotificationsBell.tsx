import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../../shared/stores/store';
import NotificationsDropdown from './NotificationsDropdown';

const NotificationsBell = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative hover:text-gray-300">
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {isDropdownOpen && <NotificationsDropdown />}
    </div>
  );
};

export default NotificationsBell;
