import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';
import { useRejectMembershipRequestMutation } from '../services/communityMembershipRequestsApi';
import { Button } from '../../../shared/components/ui/Button';

interface CancelRequestButtonProps {
  requestId: number;
}

export const CancelRequestButton: React.FC<CancelRequestButtonProps> = ({ requestId }) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const [rejectMembershipRequest, { isLoading }] = useRejectMembershipRequestMutation();

  const handleCancel = () => {
    if (currentUserId) {
      rejectMembershipRequest(requestId);
    } else {
      // Handle user not logged in
      console.log('Please log in to cancel the request.');
    }
  };

  return (
    <Button onClick={handleCancel} disabled={isLoading}>
      {isLoading ? 'Cancelling...' : 'Pending'}
    </Button>
  );
};