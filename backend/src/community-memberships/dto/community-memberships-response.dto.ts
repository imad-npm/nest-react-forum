import { Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { CommunityResponseDto } from '../../communities/dto/community-response.dto';
import { CommunityMembership } from '../entities/community-memberships.entity';
import { CommunityMembershipRole } from '../types';

export class CommunityMembershipResponseDto {
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
  role: CommunityMembershipRole;

  @Expose()
  rank: number; // Add this line

  @Expose()
  createdAt: Date;

  static fromEntity(
    entity: CommunityMembership,
  ): CommunityMembershipResponseDto {
    return plainToInstance(CommunityMembershipResponseDto, entity);
  }
}
