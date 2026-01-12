import { IsEnum, IsInt, IsString } from 'class-validator';
import { type Reactable, ReactionType } from '../reactions.types';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;

  @IsString()
  @IsEnum(['post', 'comment'])
  reactableType: Reactable;

  @IsInt()
  reactableId: number;
}
