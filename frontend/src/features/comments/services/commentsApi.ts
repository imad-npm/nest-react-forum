import { apiSlice } from '../../../shared/services/apiSlice';
import type { Comment, CreateCommentDto, UpdateCommentDto, CommentQueryDto, PaginatedResponse, ResponseDto } from '../types';

export const commentsApi = apiSlice.injectEndpoints({
    overrideExisting: false, // Ensure this is not overriding existing endpoints
    endpoints: (builder) => ({
        getComments: builder.infiniteQuery<
            PaginatedResponse<Comment>,
            CommentQueryDto, // Simplified type parameter
            number
        >({
            infiniteQueryOptions: {
                initialPageParam: 1,
                getNextPageParam: (lastPage) => {
                    const { page, totalPages } = lastPage.meta;
                    return page < totalPages ? page + 1 : undefined;
                },
            },
            query: ({ queryArg, pageParam }) => ({
                url: `/comments`,
                params: {
                    ...queryArg, // Pass other query arguments
                    page: pageParam, // Explicitly use pageParam for the page number
                    limit: queryArg?.limit ?? 10,
                },
            }),
           
            providesTags: ["Comments"],
        }),
        createComment: builder.mutation<ResponseDto<Comment>, { postId: number; data: CreateCommentDto }>({
            query: ({ postId, data }) => ({
                url: `/posts/${postId}/comments`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Comments',"Posts"],
        }),
        updateComment: builder.mutation<ResponseDto<Comment>, { id: number; data: UpdateCommentDto }>({
            query: ({ id, data }) => ({
                url: `/comments/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Comments',"Posts"],
        }),
        deleteComment: builder.mutation<ResponseDto<boolean>, number>({
            query: (id) => ({
                url: `/comments/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comments',"Posts"],
        }),
    }),
});

export const {
    useGetCommentsInfiniteQuery, // RENAMED EXPORT
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentsApi;
