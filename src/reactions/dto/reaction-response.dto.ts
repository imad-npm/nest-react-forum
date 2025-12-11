import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { PostReaction } from '../entities/post-reaction.entity';
import { CommentReaction } from '../entities/comment-reaction.entity';
import { ReactionType } from '../reactions.types';

@Exclude()
export class ReactionResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly type: ReactionType;
  @Expose() @Type(() => UserResponseDto) readonly user: UserResponseDto;
  @Expose()  postId?: number;
  @Expose()  commentId?: number;
  @Expose() readonly createdAt: Date;

  static fromEntity(entity: PostReaction | CommentReaction): ReactionResponseDto {
    const dto = plainToInstance(ReactionResponseDto, {
      ...entity,
      user: entity.user ? UserResponseDto.fromEntity(entity.user) : null,
    }, { excludeExtraneousValues: true });

    if ('postId' in entity) {
      dto.postId = entity.postId;
      dto.commentId = undefined; // Ensure commentId is not set if it's a post reaction
    } else if ('commentId' in entity) {
      dto.commentId = entity.commentId;
      dto.postId = undefined; // Ensure postId is not set if it's a comment reaction
    }

    return dto;
  }
}
