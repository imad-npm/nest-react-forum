import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsString, IsInt, IsEnum, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../entities/post.entity';

export enum PostSort {
  NEWEST = 'newest',
  POPULAR = 'popular',
  OLDEST = 'oldest',
  PUBLISHED_AT = 'published_at',
}

export { PostStatus };

export class PostQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string; // Filter by title or content

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  authorId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  communityId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  savedByUserId?: number;

  @IsOptional()
  @IsEnum(PostSort)
  sort?: PostSort;

  @IsOptional()
  @IsString()
  dateRange?: string;

  @IsOptional()
  status?: PostStatus | 'all';
}
