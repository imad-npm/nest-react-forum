import { IsEnum, IsNumber } from 'class-validator';
import { CommunityRestrictionType } from '../community-restrictions.types';

export class CreateCommunityRestrictionDto {
  @IsEnum(CommunityRestrictionType)
  restrictionType: CommunityRestrictionType;

  @IsNumber()
  communityId: number;

  @IsNumber()
  userId: number;
}
