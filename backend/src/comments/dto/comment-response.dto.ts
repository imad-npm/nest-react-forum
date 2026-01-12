import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { Comment } from '../entities/comment.entity';
import { ReactionResponseDto } from 'src/reactions/dto/reaction-response.dto';
import { PostResponseDto } from 'src/posts/dto/post-response.dto';

@Exclude()
export class CommentResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly content: string;
  @Expose() readonly createdAt: Date;
  @Expose() readonly updatedAt: Date;

  @Expose() @Type(() => UserResponseDto) readonly author: UserResponseDto;
  @Expose() readonly postId: number;
  @Expose()
@Type(() => PostResponseDto)
readonly post?: PostResponseDto;

  @Expose() readonly parentId?: number;
  @Expose() readonly likesCount: number;
  @Expose() readonly dislikesCount: number;
  @Expose() readonly repliesCount: number;
  @Expose() @Type(() => ReactionResponseDto)
  readonly userReaction?: ReactionResponseDto | null;
  @Expose()
  @Type(() => CommentResponseDto)
  readonly replies?: CommentResponseDto[];

  static fromEntity(entity: Comment & { userReaction?: any }): CommentResponseDto {
    return plainToInstance(
      CommentResponseDto,
      {
        ...entity,
        author: entity.author
          ? UserResponseDto.fromEntity(entity.author)
          : null,
        replies:
          entity.replies?.map((r) => CommentResponseDto.fromEntity(r)) ?? [],
        userReaction: entity.userReaction
          ? ReactionResponseDto.fromEntity(entity.userReaction)
          : null,
           post: entity.post
        ? PostResponseDto.fromEntity(entity.post)
        : null,
      },
      { excludeExtraneousValues: true },
    );
  }
}
