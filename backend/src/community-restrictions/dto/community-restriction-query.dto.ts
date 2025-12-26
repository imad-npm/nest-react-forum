import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CommunityRestrictionQueryDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  communityId?: number;
}
