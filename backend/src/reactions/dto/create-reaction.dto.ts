import { IsEnum, IsInt, isNumberString } from 'class-validator';
import { ReactionTarget, ReactionType } from '../reactions.types';
import { Type } from 'class-transformer';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;

   @IsEnum(ReactionTarget)
  target: ReactionTarget;

  
@IsInt()
targetId: number;

}
