import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { Comment } from '../entities/comment.entity';
import { CommentReaction } from 'src/reactions/entities/comment-reaction.entity';

@Exclude()
export class CommentResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly content: string;
  @Expose() readonly createdAt: Date;
  @Expose() readonly updatedAt: Date;

  @Expose() @Type(() => UserResponseDto) readonly author: UserResponseDto;
  @Expose() readonly postId: number;
  @Expose() readonly parentId?: number;
  @Expose() readonly likesCount: number;
  @Expose() readonly dislikesCount: number;
  @Expose() readonly userReaction?: CommentReaction | null;
  @Expose() @Type(() => CommentResponseDto) readonly replies?: CommentResponseDto[];

  static fromEntity(entity: Comment): CommentResponseDto {
    return plainToInstance(CommentResponseDto, {
      ...entity,
      author: entity.author ? UserResponseDto.fromEntity(entity.author) : null,
      replies: entity.replies?.map(r => CommentResponseDto.fromEntity(r)) ?? [],
    }, { excludeExtraneousValues: true });
  }
}
