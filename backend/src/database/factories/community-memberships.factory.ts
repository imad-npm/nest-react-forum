import { faker } from '@faker-js/faker';
import { CommunityMembership } from '../../community-memberships/entities/community-membership.entity';

export function communitySubscriptionFactory(): CommunityMembership {
  const subscription = new CommunityMembership();
  // userId and communityId will be set when seeding, as they are foreign keys
  // For now, we can just return the basic subscription object.
  return subscription;
}
