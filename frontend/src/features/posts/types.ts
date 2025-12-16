export interface Post {
    id: number;
    title: string;
    content: string;
    author: {
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
    createdAt: string;
    updatedAt: string;
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
    startDate?: string;
    endDate?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}

export interface ResponseDto<T> {
    data: T;
    message: string;
}
