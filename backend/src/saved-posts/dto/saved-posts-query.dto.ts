// backend/src/saved-posts/dto/saved-posts-query.dto.ts
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class SavedPostsQueryDto extends PaginationDto{

}