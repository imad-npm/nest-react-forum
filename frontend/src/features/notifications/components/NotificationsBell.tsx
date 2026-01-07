import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotificationsBell = () => {
  return (
    <div className="relative">
      <Link to="/notifications" className="relative hover:text-gray-300">
        <FaBell className="text-xl" />
      </Link>
    </div>
  );
};

export default NotificationsBell;
