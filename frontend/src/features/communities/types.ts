export interface Community {
  communityType: CommunityType;
  id: number;
  name: string;
  displayName: string;
  description: string;
  membersCount: number;
  createdAt: string;
  userMembershipStatus?: 'member' | 'pending' | 'none';
}

export interface CreateCommunityDto {
  name: string;
  displayName?: string;
  description?: string;
}

export interface UpdateCommunityDto extends Partial<CreateCommunityDto> {}

export interface CommunityQueryDto {
  name?: string;
  displayName?: string;
  page?: number;
  limit?: number;
}

export type CommunityType = 'public' | 'restricted' | 'private';
