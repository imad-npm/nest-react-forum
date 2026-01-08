import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGetUnreadCountQuery } from '../services/notificationsApi';

const NotificationsBell = () => {
  const { data: unreadCount } = useGetUnreadCountQuery();

  return (
    <div className="relative">
      <Link to="/notifications" className="relative hover:text-gray-300">
        <FaBell className="text-xl" />
        {unreadCount && unreadCount.data.count > 0 && (
          <span className="absolute -top-1  -right-1 bg-red-500 text-white rounded-full text-[0.6rem] w-4 h-4 flex items-center justify-center">
            {unreadCount.data.count}
          </span>
        )}
      </Link>
    </div>
  );
};

export default NotificationsBell;
