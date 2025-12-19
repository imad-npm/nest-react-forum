import { apiSlice } from '../../../shared/services/apiSlice';
import type { Comment, CreateCommentDto, UpdateCommentDto, CommentQueryDto, PaginatedResponse, ResponseDto } from '../types';

export const commentsApi = apiSlice.injectEndpoints({
    overrideExisting: false, // Ensure this is not overriding existing endpoints
    endpoints: (builder) => ({
        getCommentsByPostId: builder.infiniteQuery<
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
            query: ({ queryArg, pageParam }) => ({ // postId taken from queryArg
                url: `/posts/${queryArg.postId}/comments`, // Access postId from queryArg
                params: {
                    ...(queryArg ?? {}),
                    page: pageParam,
                    limit: queryArg?.limit ?? 10,
                },
            }),
           
            providesTags: ['Comments']
        }),
        createComment: builder.mutation<ResponseDto<Comment>, { postId: number; data: CreateCommentDto }>({
            query: ({ postId, data }) => ({
                url: `/posts/${postId}/comments`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
        }),
        updateComment: builder.mutation<ResponseDto<Comment>, { id: number; data: UpdateCommentDto }>({
            query: ({ id, data }) => ({
                url: `/comments/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Comments', id }],
        }),
        deleteComment: builder.mutation<ResponseDto<boolean>, number>({
            query: (id) => ({
                url: `/comments/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Comments', id }],
        }),
    }),
});

export const {
    useGetCommentsByPostIdInfiniteQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentsApi;
