import { IsEnum } from 'class-validator';
import { ReactionType } from '../reactions.types';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;
}
