import React from 'react';
import type { UserResponseDto } from '../../auth/types';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

interface UserPreviewProps {
  user: UserResponseDto;
}

const UserPreview: React.FC<UserPreviewProps> = ({ user }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center">
      <FaUserCircle className="text-gray-500 text-3xl mr-4" />
      <div>
        <h3 className="text-xl font-bold">
          <Link to={`/profile/${user.id}`} className="hover:underline">
            {user.username}
          </Link>
        </h3>
        {user.profile?.bio && <p className="text-sm text-gray-700">{user.profile.bio}</p>}
      </div>
    </div>
  );
};

export default UserPreview;
