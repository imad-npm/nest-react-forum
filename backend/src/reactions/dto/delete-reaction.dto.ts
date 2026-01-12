// src/reactions/dto/delete-reaction.dto.ts
import { IsEnum } from 'class-validator';
import { ReactionTarget } from '../reactions.types';

export class DeleteReactionDto {
  @IsEnum(ReactionTarget, { message: 'target must be either post or comment' })
  target: ReactionTarget;
}
