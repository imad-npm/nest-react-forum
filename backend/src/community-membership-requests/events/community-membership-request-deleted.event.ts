import { CommunityMembershipRequest } from '../entities/community-membership-request.entity';

export class CommunityMembershipRequestDeletedEvent {
  constructor(public readonly request: CommunityMembershipRequest) {}
}
