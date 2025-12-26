import { IsEnum, IsOptional } from 'class-validator';
import { CommunityRestrictionType } from '../community-restrictions.types';

export class UpdateCommunityRestrictionDto {
  @IsOptional()
  @IsEnum(CommunityRestrictionType)
  restrictionType?: CommunityRestrictionType;
}
