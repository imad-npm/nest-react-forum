import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';
import { useDeleteMembershipMutation } from '../services/communityMembershipsApi';
import { Button } from '../../../shared/components/ui/Button';

interface LeaveCommunityButtonProps {
  communityId: number;
}

export const LeaveCommunityButton: React.FC<LeaveCommunityButtonProps> = ({ communityId }) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const [deleteMembership, { isLoading }] = useDeleteMembershipMutation();

  const handleLeave = () => {
    if (currentUserId) {
      deleteMembership(communityId);
    } else {
      // Handle user not logged in
      console.log('Please log in to leave.');
    }
  };

  return (
    <Button onClick={handleLeave} disabled={isLoading}>
      {isLoading ? 'Leaving...' : 'Joined'}
    </Button>
  );
};