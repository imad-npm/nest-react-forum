import React from 'react';
import { Button } from '../../../shared/components/ui/Button';
import {
  useCancelMembershipRequestMutation,
  useCreateMembershipRequestMutation,
  useRejectMembershipRequestMutation,
} from '../../community-membership-requests/services/communityMembershipRequestsApi';
import { useDeleteOwnMembershipMutation } from '../../community-memberships/services/communityMembershipsApi';
import type { Community } from '../types';
import type { UserResponseDto } from '../../auth/types';

interface CommunityMembershipActionButtonProps {
  community: Community;
  currentUser: UserResponseDto | null;
}

export const CommunityMembershipActionButton: React.FC<
  CommunityMembershipActionButtonProps
> = ({ community, currentUser }) => {
  const [createMembershipRequest, { isLoading: isCreatingRequest }] =
    useCreateMembershipRequestMutation();
  const [deleteMembership, { isLoading: isDeletingMembership }] =
    useDeleteOwnMembershipMutation();
  const [cancelMembershipRequest, { isLoading: isRejectingRequest }] =
    useCancelMembershipRequestMutation();

  const handleJoinOrRequest = () => {
    if (currentUser) {
      createMembershipRequest(community.id);
    } else {
      console.log('Please log in to join or request membership.');
      // TODO: Implement actual login redirection or modal
    }
  };

  const handleLeave = () => {
    if (currentUser) {
      deleteMembership(community.id);
    } else {
      console.log('Please log in to leave the community.');
    }
  };

  const handleCancelRequest = () => {
    if (currentUser && community.userMembershipStatus=="pending") {
      // Assuming communityId is used to reject the user's own request
      cancelMembershipRequest(community.id);
    } else {
      console.log('Error: Cannot cancel request.');
    }
  };

  if (!currentUser) {
    return (
      <Button onClick={() => console.log('Redirect to login')} disabled>
        Login to Join
      </Button>
    ); // Or null, depending on UX
  }

  switch (community.userMembershipStatus) {
    case 'member':
      return (
        <Button onClick={handleLeave} disabled={isDeletingMembership}>
          {isDeletingMembership ? 'Leaving...' : 'Joined'}
        </Button>
      );
    case 'pending':
      return (
        <Button variant='outline' onClick={handleCancelRequest} disabled={isRejectingRequest}>
          {isRejectingRequest ? 'Cancelling...' : 'Cancel Request'}
        </Button>
      );
    case 'none':
    default:
      return (
        <Button onClick={handleJoinOrRequest} disabled={isCreatingRequest}>
          {isCreatingRequest
            ? 'Sending Request...'
            : community.communityType === 'public'
            ? 'Join'
            : 'Request to Join'}
        </Button>
      );
  }
};
