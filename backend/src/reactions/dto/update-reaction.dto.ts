import { IsEnum } from 'class-validator';
import { ReactionType } from '../reactions.types';

export class UpdateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;
}