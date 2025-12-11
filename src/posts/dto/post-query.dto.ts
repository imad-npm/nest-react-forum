import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum PostSort {
  NEWEST = 'newest',
  POPULAR = 'popular',
  OLDEST = 'oldest',
}

export class PostQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string; // Filter by title or content

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  authorId?: number;

  @IsOptional()
  @IsEnum(PostSort)
  sort?: PostSort;
}
