import { faker } from '@faker-js/faker';
import { CommunitySubscription } from '../../community-subscriptions/entities/community-subscription.entity';

export function communitySubscriptionFactory(): CommunitySubscription {
  const subscription = new CommunitySubscription();
  // userId and communityId will be set when seeding, as they are foreign keys
  // For now, we can just return the basic subscription object.
  return subscription;
}
