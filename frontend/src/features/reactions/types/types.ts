export const ReactionType = {
  LIKE: 'like',
  DISLIKE: 'dislike',
} as const;

export type ReactionType = typeof ReactionType[keyof typeof ReactionType];

export interface Reaction {
    id: number;
    type: ReactionType;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface PostReaction extends Reaction {
    postId: number;
    user: {
        id: number;
        name: string;
    };
}

export interface CommentReaction extends Reaction {
    commentId: number;
    user: {
        id: number;
        name: string;
    };
}

export interface CreateReactionDto {
    type: ReactionType;
}

export interface UpdateReactionDto {
    type: ReactionType;
}


export interface ReactionQueryDto {
    page?: number;
    limit?: number;
    type?: ReactionType;
    userId?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        itemCount: number;
    };
}

export interface ResponseDto<T> {
    data: T;
    message: string;
}
