export interface CommunityMembership {
    userId: number;
    communityId: number;
    role: CommunityRole; // Add this
    // user: UserResponseDto; // Assuming UserResponseDto exists
    // community: CommunityResponseDto; // Assuming CommunityResponseDto exists
    createdAt: string;
  }
  
  export interface CommunityMembershipQueryDto {
    userId?: number;
    communityId?: number;
    page?: number;
    limit?: number;
  }export type CommunityRole = 'admin' | 'moderator' | 'member'| 'owner';