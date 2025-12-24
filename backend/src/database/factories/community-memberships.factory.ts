import { faker } from '@faker-js/faker';
import { CommunityMembership } from '../../community-memberships/entities/community-membership.entity';

export function communityMembershipFactory(): CommunityMembership {
  const membership = new CommunityMembership();
  // userId and communityId will be set when seeding, as they are foreign keys
  // For now, we can just return the basic membership object.
  return membership;
}
