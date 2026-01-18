// backend/src/saved-posts/dto/create-saved-post.dto.ts
import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSavedPostDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  postId: number;
}