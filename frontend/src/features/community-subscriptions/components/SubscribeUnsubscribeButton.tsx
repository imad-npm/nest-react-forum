import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';
import {
  useGetCommunitySubscriptionsQuery,
  useSubscribeToCommunityMutation,
  useUnsubscribeFromCommunityMutation,
} from '../services/communitySubscriptionsApi';
import { Button } from '../../../shared/components/ui/Button';

interface SubscribeUnsubscribeButtonProps {
  communityId: number;
}

export const SubscribeUnsubscribeButton: React.FC<SubscribeUnsubscribeButtonProps> = ({ communityId }) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: subscriptionsData,
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
  } = useGetCommunitySubscriptionsQuery(
    { communityId, userId: currentUserId },
    { skip: !currentUserId }
  );

  const [subscribe] = useSubscribeToCommunityMutation();
  const [unsubscribe] = useUnsubscribeFromCommunityMutation();

  const isSubscribed = subscriptionsData?.data && subscriptionsData.data.length > 0;

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

  if (subscriptionsLoading) {
    return <Button size="sm" disabled>Loading...</Button>;
  }

  if (subscriptionsError) {
    console.error('Error loading subscription status:', subscriptionsError);
    return null; // Or some error indicator
  }

  if (!currentUserId) {
    return null; // Don't show button if user is not logged in
  }

  return (
    <>
      {isSubscribed ? (
        <Button size="sm" onClick={handleUnsubscribe}>
          Joined
        </Button>
      ) : (
        <Button size="sm" onClick={handleSubscribe}>
          Join
        </Button>
      )}
    </>
  );
};