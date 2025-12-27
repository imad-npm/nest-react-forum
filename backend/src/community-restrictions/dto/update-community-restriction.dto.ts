import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { CommunityRestrictionType } from '../community-restrictions.types';

export class UpdateCommunityRestrictionDto {
  @IsEnum(CommunityRestrictionType)
  @IsOptional()
  restrictionType?: CommunityRestrictionType;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
