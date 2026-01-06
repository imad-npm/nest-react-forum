import type { ReactionType } from "../reactions/types/types";

export const PostStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;
export type PostStatus = typeof PostStatus[keyof typeof PostStatus];
export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    id: number;
    name: string;
  };
  community?: {
    id: number;
    name: string;
  };
  views: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number; // Added commentsCount
  userReaction?: { id: number; type: ReactionType };
  userSaved?: any;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  communityId?: number;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}

export interface PostQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: number;
  sort?: string;
  dateRange?: string;
  communityId?: number;
  status?: PostStatus;
}

