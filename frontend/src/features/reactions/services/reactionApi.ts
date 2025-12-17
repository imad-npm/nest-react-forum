import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PostReaction,
  CommentReaction,
  CreateReactionDto,
  UpdateReactionDto,
  ReactionQueryDto,
  PaginatedResponse,
  ResponseDto
} from '../types/types';

export const reactionApi = createApi({
  reducerPath: 'reactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Posts', 'PostReaction', 'PostStats', 'Comment', 'CommentReaction', 'CommentStats'],
  endpoints: (builder) => ({
    getPostReactions: builder.query<PaginatedResponse<PostReaction>, { postId: number } & ReactionQueryDto>({
      query: ({ postId, ...params }) => ({ url: `/posts/${postId}/reactions`, params }),
      providesTags: (_result, _error, { postId }) => [{ type: 'PostReaction', id: postId }],
    }),

    getCommentReactions: builder.query<PaginatedResponse<CommentReaction>, { commentId: number } & ReactionQueryDto>({
      query: ({ commentId, ...params }) => ({ url: `/comments/${commentId}/reactions`, params }),
      providesTags: (_result, _error, { commentId }) => [{ type: 'CommentReaction', id: commentId }],
    }),

    createPostReaction: builder.mutation<ResponseDto<PostReaction>, { postId: number; data: CreateReactionDto }>({
      query: ({ postId, data }) => ({ url: `/posts/${postId}/reactions`, method: 'POST', body: data }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Posts', id: postId },          // <--- refresh the post itself
        { type: 'PostReaction', id: postId },
        { type: 'PostStats', id: postId },
      ],
    }),

    updatePostReaction: builder.mutation<ResponseDto<PostReaction>, { postId: number; reactionId: number; data: UpdateReactionDto }>({
      query: ({ postId, reactionId, data }) => ({ url: `/posts/${postId}/reactions/${reactionId}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'PostReaction', id: postId },
        { type: 'PostStats', id: postId },
      ],
    }),

    deletePostReaction: builder.mutation<ResponseDto<boolean>, { postId: number; reactionId: number }>({
      query: ({ postId, reactionId }) => ({ url: `/posts/${postId}/reactions/${reactionId}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'PostReaction', id: postId },
        { type: 'PostStats', id: postId },
      ],
    }),

    createCommentReaction: builder.mutation<ResponseDto<CommentReaction>, { commentId: number; data: CreateReactionDto }>({
      query: ({ commentId, data }) => ({ url: `/comments/${commentId}/reactions`, method: 'POST', body: data }),
      invalidatesTags: (_result, _error, { commentId }) => [
        { type: 'Comment', id: commentId },      // refresh comment itself
        { type: 'CommentReaction', id: commentId },
        { type: 'CommentStats', id: commentId },
      ],
    }),

    updateCommentReaction: builder.mutation<ResponseDto<CommentReaction>, { commentId: number; reactionId: number; data: UpdateReactionDto }>({
      query: ({ commentId, reactionId, data }) => ({ url: `/comments/${commentId}/reactions/${reactionId}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { commentId }) => [
        { type: 'Comment', id: commentId },
        { type: 'CommentReaction', id: commentId },
        { type: 'CommentStats', id: commentId },
      ],
    }),

    deleteCommentReaction: builder.mutation<ResponseDto<boolean>, { commentId: number; reactionId: number }>({
      query: ({ commentId, reactionId }) => ({ url: `/comments/${commentId}/reactions/${reactionId}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { commentId }) => [
        { type: 'Comment', id: commentId },
        { type: 'CommentReaction', id: commentId },
        { type: 'CommentStats', id: commentId },
      ],
    }),
  }),
});

export const {
  useGetPostReactionsQuery,
  useGetCommentReactionsQuery,
  useCreatePostReactionMutation,
  useUpdatePostReactionMutation,
  useCreateCommentReactionMutation,
  useUpdateCommentReactionMutation,
  useDeletePostReactionMutation,
  useDeleteCommentReactionMutation,
} = reactionApi;
