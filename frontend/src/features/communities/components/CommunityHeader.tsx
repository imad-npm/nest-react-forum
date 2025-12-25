import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';
import { useGetCommunityByIdQuery } from '../services/communitiesApi';
import { JoinCommunityButton } from '../../community-membership-requests/components/JoinCommunityButton';
import { LeaveCommunityButton } from '../../community-memberships/components/LeaveCommunityButton';
import { CancelRequestButton } from '../../community-membership-requests/components/CancelRequestButton';
import { Button } from '../../../shared/components/ui/Button';

interface CommunityHeaderProps {
  communityId: number;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ communityId }) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const { data, error, isLoading } = useGetCommunityByIdQuery(communityId);


  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (error || !data?.data) {
    return <div className="text-sm text-red-500">Community not found</div>;
  }

  const community = data.data;
  console.log(community);
  

  const renderMembershipButton = () => {
    if (!currentUserId) {
      return null; // Or a login button
    }

    switch (community.userMembershipStatus) {
      case 'member':
        return <LeaveCommunityButton communityId={community.id} />;
      case 'pending':
        // Assuming you can get the requestId from the community object if status is pending
        // For now, we'll just show a disabled button. You might need to adjust API to return requestId
        return <Button disabled>Pending</Button>; 
      case 'none':
      default:
        return <JoinCommunityButton communityId={community.id} />;
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
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

          {renderMembershipButton()}
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
              {community.membersCount.toLocaleString()}
            </strong>{' '}
            members
          </span>
          <span>Online</span>
        </div>
      </div>
    </div>
  );
};
