// src/posts/dto/post-response.dto.ts
import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { Post } from '../entities/post.entity';
import { ReactionResponseDto } from 'src/reactions/dto/reaction-response.dto';
import { CommunityResponseDto } from 'src/communities/dto/community-response.dto';

@Exclude()
export class PostResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly title: string;
  @Expose() readonly content: string;
  @Expose() readonly views: number;
  @Expose() readonly createdAt: Date;
  @Expose() readonly updatedAt: Date;
  @Expose() readonly publishedAt: Date;


  @Expose() @Type(() => UserResponseDto) readonly author: UserResponseDto;
  
  @Expose() @Type(() => CommunityResponseDto) readonly community?: CommunityResponseDto;

  @Expose() readonly commentsCount: number;
  @Expose() readonly likesCount: number;
  @Expose() readonly dislikesCount: number;
  
  @Expose() @Type(() => ReactionResponseDto) 
  readonly userReaction?: ReactionResponseDto | null;

  static fromEntity(entity: Post & { userReaction?: any }): PostResponseDto {
    return plainToInstance(
      PostResponseDto,
      {
        ...entity,
        author: entity.author ? UserResponseDto.fromEntity(entity.author) : null,
        community: entity.community ? CommunityResponseDto.fromEntity(entity.community) : null,
        commentsCount: entity.commentsCount,
        userReaction: entity.userReaction ? ReactionResponseDto.fromEntity(entity.userReaction) : null,
      },
      { excludeExtraneousValues: true },
    );
  }
}