export interface CommunityMembership {
    userId: number;
    communityId: number;
    role: CommunityRole; // Add this
    user: User; // Add the user object
    rank: number; // Add rank
    // community: CommunityResponseDto; // Assuming CommunityResponseDto exists
    createdAt: string;
  }

  // Define a basic User interface for the frontend (copied from community-restrictions/types.ts)
  export interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties if needed from UserResponseDto
  }
  
  export interface CommunityMembershipQueryDto {
    userId?: number;
    communityId?: number;
    page?: number;
    limit?: number;
  }export type CommunityRole =  'moderator' | 'member';