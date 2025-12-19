import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string; // Filter by content

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  authorId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  parentId?: number;
  }
