import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { Post } from '../entities/post.entity';
import { PostReaction } from 'src/reactions/entities/post-reaction.entity';
import { CommunityResponseDto } from '../../communities/dto/community-response.dto';

@Exclude()
export class PostResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly title: string;
  @Expose() readonly content: string;
  @Expose() readonly views: number;
  @Expose() readonly createdAt: Date;
  @Expose() readonly updatedAt: Date;

  @Expose() @Type(() => UserResponseDto) 
  readonly author: UserResponseDto;
  @Expose() @Type(() => CommunityResponseDto) 
  readonly community: CommunityResponseDto;

  @Expose() readonly commentsCount: number;
  @Expose() readonly likesCount: number;
  @Expose() readonly dislikesCount: number;
  @Expose() readonly userReaction?: PostReaction | null;

  static fromEntity(entity: Post): PostResponseDto {
    return plainToInstance(
      PostResponseDto,
      {
        ...entity,
        author: entity.author
          ? UserResponseDto.fromEntity(entity.author)
          : null,
        community: entity.community
          ? CommunityResponseDto.fromEntity(entity.community)
          : null,
        commentsCount: entity.comments ? entity.comments.length : 0,
      },
      { excludeExtraneousValues: true },
    );
  }
}
