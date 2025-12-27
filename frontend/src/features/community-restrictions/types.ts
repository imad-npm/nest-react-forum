// Enum compatible with React/TS
export const CommunityRestrictionType = {
  BAN: 'ban',
  MUTE: 'mute',
} as const;

export type CommunityRestrictionType = typeof CommunityRestrictionType[keyof typeof CommunityRestrictionType];

// Interface for a Community Restriction (matches backend DTO)
export interface CommunityRestriction {
  id: number;
  communityId: number;
  userId: number;
  createdById: number;
  restrictionType: CommunityRestrictionType;
  reason?: string;
  expiresAt?: string | null; // ISO string or null
  createdAt: string;          // ISO string
}

// DTO for creating a community restriction
export interface CreateCommunityRestrictionDto {
  communityId: number;
  userId: number;
  restrictionType: CommunityRestrictionType;
  reason?: string;
  expiresAt?: string; // ISO string
}

// DTO for updating a community restriction
export interface UpdateCommunityRestrictionDto {
  restrictionType?: CommunityRestrictionType;
  reason?: string;
  expiresAt?: string; // ISO string
}

// Query parameters for fetching community restrictions
export interface CommunityRestrictionQueryDto{
  page?: number;
  limit?: number;
  communityId?: number;
  userId?: number;
  restrictionType?: CommunityRestrictionType;
}
