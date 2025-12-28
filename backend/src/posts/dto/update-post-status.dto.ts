import { IsEnum } from 'class-validator';
import { PostStatus } from '../entities/post.entity';

export class UpdatePostStatusDto {
  @IsEnum(PostStatus)
  status: PostStatus;
}
