// backend/src/community-moderators/dto/community-moderator-query.dto.ts
import { IsOptional, IsNumberString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CommunityModeratorQueryDto extends PaginationDto {
  @IsOptional()
  @IsNumberString()
  userId?: number;
}
