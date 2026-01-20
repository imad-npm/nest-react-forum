import { CommunityMembershipRequest } from '../entities/community-membership-request.entity';

export class CommunityMembershipRequestAcceptedEvent {
  constructor(public readonly request: CommunityMembershipRequest) {}
}
