import { IsNumber, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { CommunityRestrictionType } from '../community-restrictions.types';

export class CreateCommunityRestrictionDto {
  @IsNumber()
  communityId: number;

  @IsNumber()
  userId: number;

  @IsEnum(CommunityRestrictionType)
  restrictionType: CommunityRestrictionType;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}