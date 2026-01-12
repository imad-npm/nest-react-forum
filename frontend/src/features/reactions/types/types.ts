// reactions.types.ts

// Reaction types
export const ReactionType = {
  LIKE: 'like',
  DISLIKE: 'dislike',
} as const;

export const Reactable = {
  Post: 'post',
  Comment: 'comment',
} as const;

// TypeScript types
export type ReactionType = typeof ReactionType[keyof typeof ReactionType];
export type Reactable = typeof Reactable[keyof typeof Reactable];

// Reaction interface (matches DB entity)
export interface Reaction {
  id: number;
  type: ReactionType;
  userId: number;
  user: {
    id: number;
    name: string;
  };
  reactableId: number;       // polymorphic target id
  reactableType: Reactable; // polymorphic target type
  createdAt: string;
  updatedAt: string;
}

// DTOs

// Create reaction
export interface CreateReactionDto {
  type: ReactionType;
  reactableId: number;
  reactableType: Reactable;
}

// Update reaction
export interface UpdateReactionDto {
  type: ReactionType;

}


// Query reaction (for findAll)
export interface ReactionQueryDto {
  page?: number;
  limit?: number;
  type?: ReactionType;
  userId?: number;
  reactableId?: number;
  reactableType?: Reactable;
}
