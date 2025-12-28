import { Expose, Transform, Type } from 'class-transformer';
import { CommunityRestrictionType } from '../community-restrictions.types';
import { CommunityRestriction } from '../entities/community-restriction.entity';
import { UserResponseDto } from '../../users/dtos/user-response.dto'; // Import UserResponseDto

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
  @Type(() => UserResponseDto) // Expose the full user object
  user: UserResponseDto | null; // Add user property

  @Expose()
  @Transform(({ obj }) => obj.createdBy.id)
  createdById: number;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt: Date;

  static fromEntity(entity: CommunityRestriction): CommunityRestrictionResponseDto {
    const dto = new CommunityRestrictionResponseDto();
    Object.assign(dto, entity);
    // Manually map the user entity to UserResponseDto
    dto.user = entity.user ? UserResponseDto.fromEntity(entity.user) : null;
    return dto;
  }
}
