import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ReactionType } from '../entities/reaction.entity';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;

  @IsOptional()
  @IsNumber()
  postId?: number;

  @IsOptional()
  @IsNumber()
  commentId?: number;
}
