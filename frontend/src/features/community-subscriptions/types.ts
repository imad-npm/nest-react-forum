export interface CommunitySubscription {
    userId: number;
    communityId: number;
    // user: UserResponseDto; // Assuming UserResponseDto exists
    // community: CommunityResponseDto; // Assuming CommunityResponseDto exists
    createdAt: string;
  }
  
  export interface CommunitySubscriptionQueryDto {
    userId?: number;
    communityId?: number;
    page?: number;
    limit?: number;
  }