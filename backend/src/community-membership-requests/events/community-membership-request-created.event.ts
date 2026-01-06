import { CommunityMembershipRequest } from '../entities/community-membership-request.entity';

export class CommunityMembershipRequestCreatedEvent {
  constructor(public readonly request: CommunityMembershipRequest) {}
}
