import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { CommunityResponseDto } from '../../communities/dto/community-response.dto';
import { CommunityMembershipRequest, CommunityMembershipRequestStatus } from '../entities/community-membership-request.entity';

@Exclude()
export class CommunityMembershipRequestResponseDto {
  @Expose() readonly id: number;

  @Expose() readonly userId: number;
  @Expose() readonly communityId: number;

  @Expose() @Type(() => UserResponseDto) readonly user: UserResponseDto;
  @Expose() @Type(() => CommunityResponseDto) readonly community: CommunityResponseDto;

  @Expose() readonly status: CommunityMembershipRequestStatus;
  @Expose() readonly createdAt: Date;

  static fromEntity(entity: CommunityMembershipRequest): CommunityMembershipRequestResponseDto {
    return plainToInstance(
      CommunityMembershipRequestResponseDto,
      {
        ...entity,
        user: entity.user ? UserResponseDto.fromEntity(entity.user) : null,
        community: entity.community ? CommunityResponseDto.fromEntity(entity.community) : null,
      },
      { excludeExtraneousValues: true },
    );
  }
}
