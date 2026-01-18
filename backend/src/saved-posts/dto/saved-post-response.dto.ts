// src/posts/dto/post-response.dto.ts
import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { SavedPost } from '../entities/saved-post.entity';
import { PostResponseDto } from 'src/posts/dto/post-response.dto';

@Exclude()
export class SavedPostResponseDto {
  @Expose() readonly id: number;

  @Expose() readonly savedAt: Date;
  
@Expose()
  readonly userId: number;

  @Expose()
  readonly postId: number;
 
    @Expose()
   @Type(() => PostResponseDto)
   readonly post: PostResponseDto;
  
  
  static fromEntity(entity: SavedPost ): SavedPostResponseDto {
    return plainToInstance(
      SavedPostResponseDto,
      {
        ...entity,
        post: entity.post ? PostResponseDto.fromEntity(entity.post) : null,
},
      { excludeExtraneousValues: true },
    );
  }
}