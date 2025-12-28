import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsString, IsInt, IsEnum, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../entities/post.entity';

export enum PostSort {
  NEWEST = 'newest',
  POPULAR = 'popular',
  OLDEST = 'oldest',
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
  @IsEnum(PostSort)
  sort?: PostSort;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}
