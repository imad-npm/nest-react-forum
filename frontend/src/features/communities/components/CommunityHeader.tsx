import React from 'react';
import { useGetCommunityByIdQuery } from '../services/communitiesApi';
import { SubscribeUnsubscribeButton } from '../../community-subscriptions/components/SubscribeUnsubscribeButton';

interface CommunityHeaderProps {
  communityId: number;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ communityId }) => {
  const { data, error, isLoading } = useGetCommunityByIdQuery(communityId);

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (error || !data?.data) {
    return <div className="text-sm text-red-500">Community not found</div>;
  }

  const community = data.data;

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      {/* Banner */}
      <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-600" />

      {/* Content */}
      <div className="relative px-4 pb-4">
        {/* Avatar */}
        <div className="absolute -top-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-2xl font-bold text-gray-600">
          {community.displayName.charAt(0).toUpperCase()}
        </div>

        <div className="ml-24 flex items-start justify-between pt-2">
          <div>
            <h1 className="text-xl font-semibold leading-tight">
              {community.displayName}
            </h1>
            <p className="text-sm text-gray-500">r/{community.name}</p>
          </div>

          <SubscribeUnsubscribeButton communityId={community.id} />
        </div>

        {/* Description */}
        {community.description && (
          <p className="mt-3 text-sm text-gray-700">
            {community.description}
          </p>
        )}

        {/* Stats */}
        <div className="mt-3 flex gap-4 text-sm text-gray-600">
          <span>
            <strong className="text-gray-900">
              {community.subscribersCount.toLocaleString()}
            </strong>{' '}
            members
          </span>
          <span>Online</span>
        </div>
      </div>
    </div>
  );
};
