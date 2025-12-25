import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';
import { useGetCommunityByIdQuery } from '../services/communitiesApi';
import { Link } from 'react-router-dom';
import { JoinCommunityButton } from '../../community-membership-requests/components/JoinCommunityButton';
import { LeaveCommunityButton } from '../../community-memberships/components/LeaveCommunityButton';
import { CancelRequestButton } from '../../community-membership-requests/components/CancelRequestButton';
import { Button } from '../../../shared/components/ui/Button';

interface AboutCommunityProps {
  communityId: number;
}

export const AboutCommunity: React.FC<AboutCommunityProps> = ({ communityId }) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: communityData, error: communityError, isLoading: communityLoading } = useGetCommunityByIdQuery(communityId);


  if (communityLoading) {
    return <div className="p-4 bg-white rounded-lg shadow">Loading community info...</div>;
  }

  if (communityError || !communityData?.data) {
    return <div className="p-4 bg-white rounded-lg shadow text-red-500">Community not found</div>;
  }

  const community = communityData.data;

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
    <div className="bg-white rounded-lg border border-gray-300 p-4">
      <h2 className="text-lg font-semibold mb-2">
        About <Link to={`/communities/${community.id}`} className="text-primary-600 hover:underline">r/{community.name}</Link></h2>
      {community.description && <p className="text-sm text-gray-700 mb-3">{community.description}</p>}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
        <span>Members: {community.membersCount.toLocaleString()}</span>
        <span>Created: {new Date(community.createdAt).toLocaleDateString()}</span>
      </div>
      {renderMembershipButton()}
    </div>
  );
};
