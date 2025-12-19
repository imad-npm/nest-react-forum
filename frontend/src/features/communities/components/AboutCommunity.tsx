import React from 'react';
import { useGetCommunityByIdQuery } from '../services/communitiesApi';
import { Link } from 'react-router-dom';
import { SubscribeUnsubscribeButton } from '../../community-subscriptions/components/SubscribeUnsubscribeButton';

interface AboutCommunityProps {
  communityId: number;
}

export const AboutCommunity: React.FC<AboutCommunityProps> = ({ communityId }) => {
  const { data: communityData, error: communityError, isLoading: communityLoading } = useGetCommunityByIdQuery(communityId);

  if (communityLoading) {
    return <div className="p-4 bg-white rounded-lg shadow">Loading community info...</div>;
  }

  if (communityError || !communityData?.data) {
    return <div className="p-4 bg-white rounded-lg shadow text-red-500">Community not found</div>;
  }

  const community = communityData.data;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">
        About <Link to={`/communities/${community.id}`} className="text-blue-600 hover:underline">r/{community.name}</Link></h2>
      {community.description && <p className="text-sm text-gray-700 mb-3">{community.description}</p>}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
        <span>Members: {community.subscribersCount.toLocaleString()}</span>
        <span>Created: {new Date(community.createdAt).toLocaleDateString()}</span>
      </div>
      <SubscribeUnsubscribeButton communityId={community.id} />
    </div>
  );
};
