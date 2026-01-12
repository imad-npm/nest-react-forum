import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsEnum, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { type Reactable, ReactionType } from '../reactions.types';

export class ReactionQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ReactionType)
  type?: ReactionType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @IsString()
  @IsEnum(['post', 'comment'])
  reactableType: Reactable;

  @IsInt()
  @Type(() => Number)
  reactableId: number;
}
