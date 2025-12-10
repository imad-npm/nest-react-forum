import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { Reaction } from '../entities/reaction.entity';
import { ReactionType } from '../entities/reaction.entity';

@Exclude()
export class ReactionResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly type: ReactionType;
  @Expose() @Type(() => UserResponseDto) readonly user: UserResponseDto;
  @Expose() readonly postId?: number | null;
  @Expose() readonly commentId?: number | null;
  @Expose() readonly createdAt: Date;

  static fromEntity(entity: Reaction): ReactionResponseDto {
    return plainToInstance(ReactionResponseDto, {
      ...entity,
      user: entity.user ? UserResponseDto.fromEntity(entity.user) : null,
    }, { excludeExtraneousValues: true });
  }
}
