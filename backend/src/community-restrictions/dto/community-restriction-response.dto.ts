import { Expose, Transform, Type } from 'class-transformer';
import { CommunityRestrictionType } from '../community-restrictions.types';
import { CommunityRestriction } from '../entities/community-restriction.entity';

export class CommunityRestrictionResponseDto {
  @Expose()
  id: number;

  @Expose()
  restrictionType: CommunityRestrictionType;

  @Expose()
  reason: string;

  @Expose()
  @Transform(({ value }) => value ? value.toISOString() : null)
  expiresAt: Date | null;

  @Expose()
  @Transform(({ obj }) => obj.community.id)
  communityId: number;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;

  
  @Expose()
  @Transform(({ obj }) => obj.createdBy.id)
  createdById: number;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt: Date;

  static fromEntity(entity: CommunityRestriction): CommunityRestrictionResponseDto {
    return Object.assign(
      new CommunityRestrictionResponseDto(),
      entity,
    );
  }
}
