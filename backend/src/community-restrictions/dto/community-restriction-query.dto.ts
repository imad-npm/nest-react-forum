import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CommunityRestrictionType } from '../community-restrictions.types';
import { Type } from 'class-transformer';

export class CommunityRestrictionQueryDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  communityId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsEnum(CommunityRestrictionType)
  restrictionType?: CommunityRestrictionType;
}