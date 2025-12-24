export interface Community {
  id: number;
  name: string;
  displayName: string;
  description: string;
  isPublic: boolean;
  membersCount: number;
  createdAt: string;
}

export interface CreateCommunityDto {
  name: string;
  displayName?: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateCommunityDto extends Partial<CreateCommunityDto> {}

export interface CommunityQueryDto {
  name?: string;
  displayName?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
}