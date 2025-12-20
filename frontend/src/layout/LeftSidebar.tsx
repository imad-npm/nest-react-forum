import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCompass, FaUsers, FaPlusSquare } from 'react-icons/fa'; // Example icons

const LeftSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white p-4 border-r border-gray-300 h-screen sticky top-0 hidden md:block">
      <nav className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Navigation</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-gray-700">
                <FaHome /> <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/discover" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-gray-700">
                <FaCompass /> <span>Discover</span>
              </Link>
            </li>
            <li>
              <Link to="/explore-communities" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-gray-700">
                <FaUsers /> <span>Explore Communities</span>
              </Link>
            </li>
            <li>
              <Link to="/my-communities" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-gray-700">
                <FaUsers /> <span>My Communities</span>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Actions</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/submit" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-gray-700">
                <FaPlusSquare /> <span>Create Post</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
