import { isEnum, IsEnum, IsInt, isInt } from 'class-validator';
import { ReactionTarget, ReactionType } from '../reactions.types';

export class UpdateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;

  @IsEnum(ReactionTarget)
  target: ReactionTarget;

}