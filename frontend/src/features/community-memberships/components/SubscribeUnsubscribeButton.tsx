import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';
import {
  useGetCommunityMembershipsQuery,
  useSubscribeToCommunityMutation,
  useUnsubscribeFromCommunityMutation,
} from '../services/communityMembershipsApi';
import { Button } from '../../../shared/components/ui/Button';

interface SubscribeUnsubscribeButtonProps {
  communityId: number;
}

export const SubscribeUnsubscribeButton: React.FC<SubscribeUnsubscribeButtonProps> = ({ communityId }) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: membershipsData,
    isLoading: membershipsLoading,
    error: membershipsError,
  } = useGetCommunityMembershipsQuery(
    { communityId, userId: currentUserId },
    { skip: !currentUserId }
  );

  const [subscribe] = useSubscribeToCommunityMutation();
  const [unsubscribe] = useUnsubscribeFromCommunityMutation();

  const isSubscribed = membershipsData?.data && membershipsData.data.length > 0;

  const handleSubscribe = () => {
    if (currentUserId) {
      subscribe(communityId);
    } else {
      console.log('Please log in to subscribe.');
      // TODO: Implement proper login redirect or prompt
    }
  };

  const handleUnsubscribe = () => {
    if (currentUserId) {
      unsubscribe(communityId);
    } else {
      console.log('Please log in to unsubscribe.');
      // TODO: Implement proper login redirect or prompt
    }
  };

  if (membershipsLoading) {
    return <Button size="sm" disabled>Loading...</Button>;
  }

  if (membershipsError) {
    console.error('Error loading membership status:', membershipsError);
    return null; // Or some error indicator
  }

  if (!currentUserId) {
    return null; // Don't show button if user is not logged in
  }

  return (
    <>
      {isSubscribed ? (
        <Button  onClick={handleUnsubscribe}>
          Joined
        </Button>
      ) : (
        <Button  onClick={handleSubscribe}>
          Join
        </Button>
      )}
    </>
  );
};