import { IsNumber, IsEnum, IsOptional, IsString, IsDateString, IsDate } from 'class-validator';
import { CommunityRestrictionType } from '../community-restrictions.types';
import { Type } from 'class-transformer';

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
@IsDate() // Use @IsDate() instead of @IsDateString()
@Type(() => Date) // Automatically converts string to Date object
  expiresAt?: Date;
}