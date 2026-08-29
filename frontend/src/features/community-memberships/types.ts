import type { Community } from "../communities/types";
import type { UserResponseDto } from "../user/types";

export interface CommunityMembership {
    userId: number;
    communityId: number;
    role: CommunityRole; // Add this
    user: UserResponseDto; // Add the user object
    rank: number; // Add rank
    community: Community; // Assuming CommunityResponseDto exists
    createdAt: string;
  }

 
  
  export interface CommunityMembershipQueryDto {
    userId?: number;
    communityId?: number;
    role? :CommunityRole
    page?: number;
    limit?: number;
  }
  
  export type CommunityRole =  'moderator' | 'member';