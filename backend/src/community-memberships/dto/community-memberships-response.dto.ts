import { Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { CommunityResponseDto } from '../../communities/dto/community-response.dto';
import { CommunityMembership } from '../entities/community-membership.entity';
import { CommunitySubscriptionStatus } from '../types';

export class CommunitySubscriptionResponseDto {
  @Expose()
  userId: number;

  @Expose()
  communityId: number;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => CommunityResponseDto)
  community: CommunityResponseDto;

  @Expose()
  status: CommunitySubscriptionStatus;

  @Expose()
  createdAt: Date;

  static fromEntity(
    entity: CommunityMembership,
  ): CommunitySubscriptionResponseDto {
    return plainToInstance(CommunitySubscriptionResponseDto, entity);
  }
}
