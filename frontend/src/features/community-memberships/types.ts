export interface CommunityMembership {
    userId: number;
    communityId: number;
    // user: UserResponseDto; // Assuming UserResponseDto exists
    // community: CommunityResponseDto; // Assuming CommunityResponseDto exists
    createdAt: string;
  }
  
  export interface CommunityMembershipQueryDto {
    userId?: number;
    communityId?: number;
    page?: number;
    limit?: number;
  }