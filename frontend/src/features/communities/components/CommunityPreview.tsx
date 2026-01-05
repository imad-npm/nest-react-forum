import React from 'react';
import type { Community } from '../types';
import { Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';

interface CommunityPreviewProps {
  community: Community;
}

const CommunityPreview: React.FC<CommunityPreviewProps> = ({ community }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
      <div className="flex items-center">
        <FaUsers className="text-gray-500 text-3xl mr-4" />
        <div>
          <h3 className="text-xl font-bold">
            <Link to={`/communities/${community.id}`} className="hover:underline">
              {community.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 mb-1">{community.membersCount} members</p>
          <p className="text-sm text-gray-700">{community.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityPreview;
