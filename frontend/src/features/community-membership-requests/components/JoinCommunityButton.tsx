import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';
import { useCreateMembershipRequestMutation } from '../../community-membership-requests/services/communityMembershipRequestsApi';
import { Button } from '../../../shared/components/ui/Button';

interface JoinCommunityButtonProps {
  communityId: number;
}

export const JoinCommunityButton: React.FC<JoinCommunityButtonProps> = ({ communityId }) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const [createMembershipRequest, { isLoading }] = useCreateMembershipRequestMutation();

  const handleJoin = () => {
    if (currentUserId) {
      createMembershipRequest(communityId);
    } else {
      // Handle user not logged in
      console.log('Please log in to join.');
    }
  };

  return (
    <Button onClick={handleJoin} disabled={isLoading}>
      {isLoading ? 'Sending Request...' : 'Join'}
    </Button>
  );
};