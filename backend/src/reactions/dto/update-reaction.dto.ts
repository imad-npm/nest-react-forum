import { IsEnum } from 'class-validator';
import { ReactionTarget, ReactionType } from '../reactions.types';

export class UpdateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;

     target: ReactionTarget;
    targetId?: number;
}