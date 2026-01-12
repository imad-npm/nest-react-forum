import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ReactionTarget, ReactionType } from '../reactions.types';

export class ReactionQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ReactionType)
  type?: ReactionType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

   target: ReactionTarget;
  targetId?: number;
}
