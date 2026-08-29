import type { Comment } from "../../comments/types";
import type { Post } from "../../posts/types";

export const ReactionType = {
  LIKE: 'like',
  DISLIKE: 'dislike',
} as const;

export type ReactionType =
  typeof ReactionType[keyof typeof ReactionType];

export const Reactable = {
  POST: 'post',
  COMMENT: 'comment',
} as const;

export type Reactable =
  typeof Reactable[keyof typeof Reactable];

export interface Reaction {
  id: number;
  type: ReactionType;
  userId: number;
  user: {
    id: number;
    name: string;
  };
  reactableId: number;
  reactableType: Reactable;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReactionDto {
  type: ReactionType;
  reactableId: number;
  reactableType: Reactable;
}

export interface UpdateReactionDto {
  type: ReactionType;
}

export interface ReactionQueryDto {
  page?: number;
  limit?: number;
  type?: ReactionType;
  userId?: number;
  reactableId?: number;
  reactableType?: Reactable;
}

export type ReactableEntity = Post | Comment;