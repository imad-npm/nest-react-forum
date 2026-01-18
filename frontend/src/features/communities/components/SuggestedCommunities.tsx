import React from 'react';
import { useGetCommunitiesQuery } from '../services/communitiesApi';
import { Link } from 'react-router-dom';

const SuggestedCommunities = () => {
  const { data, isLoading, isError } = useGetCommunitiesQuery({ sort: 'popular', limit: 5 });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Suggested Communities</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-red-600">
        <h2 className="text-xl font-semibold mb-4">Suggested Communities</h2>
        <p>Error loading suggested communities.</p>
      </div>
    );
  }

  const communities = data?.data || [];

  if (communities.length === 0) {
    return null; // Or a message like "No suggestions"
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4">
      <h2 className="text-xl font-semibold mb-4">Suggested Communities</h2>
      <ul>
        {communities.map((community) => (
          <li key={community.id} className="mb-2 last:mb-0">
            <Link to={`/communities/${community.id}`} className="text-primary-600 hover:underline">
              {community.displayName || community.name}
            </Link>
            <p className="text-sm text-gray-500">{community.membersCount} members</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedCommunities;
