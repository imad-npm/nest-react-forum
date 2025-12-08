// src/posts/dto/update-post.dto.ts

import { PartialType } from '@nestjs/mapped-types'; // <-- 1. Make sure this is imported
import { CreatePostDto } from './create-post.dto';   // <-- 2. Make sure you import CreatePostDto

// 3. Extend PartialType of your base DTO
export class UpdatePostDto extends PartialType(CreatePostDto) {
  // If you need to add custom validation or properties, they go here.
  // Otherwise, leave the body empty.
}