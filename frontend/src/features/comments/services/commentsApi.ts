import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Comment, CreateCommentDto, UpdateCommentDto, CommentQueryDto, PaginatedResponse, ResponseDto } from '../types';

export const commentsApi = createApi({
    reducerPath: 'commentsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
    tagTypes: ['Comments'],
    endpoints: (builder) => ({
        getCommentsByPostId: builder.query<PaginatedResponse<Comment>, CommentQueryDto & { postId: number }>({
            query: ({ postId, ...params }) => ({
                url: `/posts/${postId}/comments`,
                params: params,
            }),
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.postId}`;
            },
            merge: (currentCache, newItems) => {
                currentCache.data.push(...newItems.data);
                currentCache.meta = newItems.meta;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
            providesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
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
    useGetCommentsByPostIdQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentsApi;
