import type { ReactionType } from "../reactions/types/types";
import type { Post } from "../../posts/types";

export interface Comment {
    id: number;
    content: string;
    author: {
        id: number;
        name: string;
        username: string;
    };
    postId: number;
    parentId?: number; // For replies
    likesCount: number;
    dislikesCount: number;
    repliesCount: number;
    userReaction?: { id: number; type: ReactionType } | null;
    replies?: Comment[]; // Added for nested replies
    post?: Post; // Re-added for UserCommentCard

    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentDto {
    content: string;
    parentId?: number;
}

export interface UpdateCommentDto {
    content: string;
}

export interface CommentQueryDto {
    page?: number;
    limit?: number;
    postId?: number;
    authorId?: number;
    parentId?: number;
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
