// frontend/src/features/saved-posts/types/saved-post.ts

import type { Post } from "../posts/types";

export interface SavedPost {
  id: number;
  userId: number;
  postId: number;
  post: Post;      // Reuses the core Post type [cite: 12274]
  savedAt: string; // Dates are typically strings in JSON responses
}


export interface CreateSavedPostDto {
  postId: number;
}

export interface SavedPostQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: number;
  sort?: string;

}