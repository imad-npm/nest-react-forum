import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ReactionType } from '../entities/reaction.entity';

export class ReactionQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ReactionType)
  type?: ReactionType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;
}
