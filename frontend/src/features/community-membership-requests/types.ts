import type { UserResponseDto } from "../user/types";

// Replace enum with const object
export const CommunityMembershipRequestSort = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
} as const;

export type CommunityMembershipRequestSort = (typeof CommunityMembershipRequestSort)[keyof typeof CommunityMembershipRequestSort];

export const CommunityMembershipRequestStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export type CommunityMembershipRequestStatus = (typeof CommunityMembershipRequestStatus)[keyof typeof CommunityMembershipRequestStatus];

// Define a basic User interface for the frontend


export interface CommunityMembershipRequest {
    id: number;
    userId: number;
    communityId: number;
    user: UserResponseDto; // Add the user object
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
  }
  
export interface CommunityMembershipRequestQueryDto {
  page?: number;
  limit?: number;
  userId?: number;
  communityId?: number;
  status?: CommunityMembershipRequestStatus; // ✅ include it
  sort?: CommunityMembershipRequestSort;
}

