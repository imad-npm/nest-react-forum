// backend/src/community-moderators/dto/community-moderator-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { CommunityResponseDto } from '../../communities/dto/community-response.dto';
import { CommunityModerator } from '../entities/community-moderator.entity'; // Import CommunityModerator

export class CommunityModeratorResponseDto {
  @Expose()
  moderatorId: number;

  @Expose()
  communityId: number;

  @Expose()
  @Type(() => UserResponseDto)
  moderator: UserResponseDto;

  @Expose()
  @Type(() => CommunityResponseDto)
  community: CommunityResponseDto;

  static fromEntity(entity: CommunityModerator): CommunityModeratorResponseDto {
    const dto = new CommunityModeratorResponseDto();
    dto.moderatorId = entity.moderatorId;
    dto.communityId = entity.communityId;
    dto.moderator = entity.moderator;
    dto.community = CommunityResponseDto.fromEntity(entity.community);
    return dto;
  }
}
