import { apiSlice } from '../../../shared/services/apiSlice';
import type {
  PostReaction,
  CommentReaction,
  CreateReactionDto,
  UpdateReactionDto,
  ReactionQueryDto,
  PaginatedResponse,
  ResponseDto
} from '../types/types';

export const reactionApi = apiSlice.injectEndpoints({
  overrideExisting: false, // Ensure this is not overriding existing endpoints
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
      invalidatesTags: ['Posts']
    }),

    updatePostReaction: builder.mutation<ResponseDto<PostReaction>, { postId: number; reactionId: number; data: UpdateReactionDto }>({
      query: ({ postId, reactionId, data }) => ({ url: `/posts/${postId}/reactions/${reactionId}`, method: 'PATCH', body: data }),
            invalidatesTags: ['Posts']

    }),

    deletePostReaction: builder.mutation<ResponseDto<boolean>, { postId: number; reactionId: number }>({
      query: ({ postId, reactionId }) => ({ url: `/posts/${postId}/reactions/${reactionId}`, method: 'DELETE' }),
          invalidatesTags: ['Posts']

    }),

    createCommentReaction: builder.mutation<ResponseDto<CommentReaction>, { commentId: number; data: CreateReactionDto }>({
      query: ({ commentId, data }) => ({ url: `/comments/${commentId}/reactions`, method: 'POST', body: data }),
      invalidatesTags: ['Comments'],
    }),

    updateCommentReaction: builder.mutation<ResponseDto<CommentReaction>, { commentId: number; reactionId: number; data: UpdateReactionDto }>({
      query: ({ commentId, reactionId, data }) => ({ url: `/comments/${commentId}/reactions/${reactionId}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Comments'],
    }),

    deleteCommentReaction: builder.mutation<ResponseDto<boolean>, { commentId: number; reactionId: number }>({
      query: ({ commentId, reactionId }) => ({ url: `/comments/${commentId}/reactions/${reactionId}`, method: 'DELETE' }),
      invalidatesTags: ['Comments'],
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
