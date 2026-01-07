import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';
import NotificationsDropdown from './NotificationsDropdown';

const NotificationsBell = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative hover:text-gray-300">
        <FaBell className="text-xl" />
        
     
      </button>
      {isDropdownOpen && <NotificationsDropdown />}
    </div>
  );
};

export default NotificationsBell;
