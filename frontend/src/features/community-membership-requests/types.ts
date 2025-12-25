export interface CommunityMembershipRequest {
    id: number;
    userId: number;
    communityId: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
  }
  