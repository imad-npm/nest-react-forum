import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CommunityMembershipRequestStatus } from '../entities/community-membership-request.entity';

export enum CommunityMembershipRequestSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class CommunityMembershipRequestQueryDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  communityId?: number;

  @IsOptional()
  @IsEnum(CommunityMembershipRequestStatus)
  status?: CommunityMembershipRequestStatus;

  @IsOptional()
  @IsEnum(CommunityMembershipRequestSort)
  sort?: CommunityMembershipRequestSort;
}
