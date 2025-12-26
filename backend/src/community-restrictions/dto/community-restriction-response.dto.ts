import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { CommunityRestriction } from '../entities/community-restriction.entity';
import { CommunityResponseDto } from 'src/communities/dto/community-response.dto';
import { CommunityRestrictionType } from '../community-restrictions.types';

@Exclude()
export class CommunityRestrictionResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly restrictionType: CommunityRestrictionType;
  @Expose() readonly createdAt: Date;

  @Expose() @Type(() => UserResponseDto) readonly user: UserResponseDto;
  @Expose() @Type(() => CommunityResponseDto) readonly community: CommunityResponseDto;

  static fromEntity(entity: CommunityRestriction): CommunityRestrictionResponseDto {
    return plainToInstance(
      CommunityRestrictionResponseDto,
      {
        ...entity,
        user: entity.user ? UserResponseDto.fromEntity(entity.user) : null,
        community: entity.community ? CommunityResponseDto.fromEntity(entity.community) : null,
      },
      { excludeExtraneousValues: true },
    );
  }
}
