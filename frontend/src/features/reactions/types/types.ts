export const ReactionType = {
    LIKE: 'like',
    DISLIKE: 'dislike',
} as const;

export const ReactionTarget = {
   Post : 'post',
  Comment : 'comment',
} as const;

export type ReactionType = typeof ReactionType[keyof typeof ReactionType];
export type ReactionTarget = typeof ReactionTarget[keyof typeof ReactionTarget];

export interface Reaction {
    id: number;
    type: ReactionType;
    userId: number;
    user: {
        id: number;
        name: string;
    };
    target: ReactionTarget;

    targetId: number;
    createdAt: string;
    updatedAt: string;
}



export interface CreateReactionDto {
    type: ReactionType;
     target: ReactionTarget;

    targetId: number;
}

export interface UpdateReactionDto {
    type: ReactionType;
    target: ReactionTarget;

    targetId: number;
}

export interface DeleteReactionDto {
    target: ReactionTarget;

}


export interface ReactionQueryDto {
    page?: number;
    limit?: number;
    type?: ReactionType;
    userId?: number;
    target: ReactionTarget;

    targetId?: number;
}


