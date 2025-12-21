import { Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { CommunityResponseDto } from '../../communities/dto/community-response.dto';
import { CommunitySubscription } from '../entities/community-subscription.entity';
import { CommunitySubscriptionStatus } from '../community-subscription-status.enum';

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
    entity: CommunitySubscription,
  ): CommunitySubscriptionResponseDto {
    return plainToInstance(CommunitySubscriptionResponseDto, entity);
  }
}
