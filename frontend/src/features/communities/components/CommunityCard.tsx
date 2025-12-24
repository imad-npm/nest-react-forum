import React from 'react';
import type { Community } from '../types';
import { Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 p-4 flex flex-col justify-between border border-gray-300 hover:shadow-lg transition-shadow duration-200">
      <div>
        <Link to={`/communities/${community.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 mb-2">
            c/{community.name}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
          {community.description || 'No description provided.'}
        </p>
      </div>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <FaUsers className="mr-1" />
        <span>{community.membersCount || 0} subscribers</span>
      </div>
    </div>
  );
};

export default CommunityCard;
