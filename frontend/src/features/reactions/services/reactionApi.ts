import { apiSlice } from '../../../shared/services/apiSlice';
import type { PaginatedResponse, ResponseDto } from '../../../shared/types';
import type {
  Reaction,
  CreateReactionDto,
  UpdateReactionDto,
  DeleteReactionDto,
  ReactionQueryDto,
} from '../types/types';

const invalidateByTarget = (target: 'post' | 'comment') => [
  { type: 'Reactions' as const },
  target === 'post'
    ? { type: 'Posts' as const }
    : { type: 'Comments' as const },
];

export const reactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // LIST
    getReactions: builder.query<
      PaginatedResponse<Reaction>,
      ReactionQueryDto
    >({
      query: (params) => ({
        url: '/reactions',
        params,
      }),
      providesTags: ['Reactions'],

    }),

    // CREATE
    createReaction: builder.mutation<
      ResponseDto<Reaction>,
      CreateReactionDto
    >({
      query: (body) => ({
        url: '/reactions',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, { target }) =>
        invalidateByTarget(target),
    }),

    // UPDATE
    updateReaction: builder.mutation<
      ResponseDto<Reaction>,
      { id: number; data: UpdateReactionDto }
    >({
      query: ({ id, data }) => ({
        url: `/reactions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { data }) =>
        invalidateByTarget(data.target),
    }),

    // DELETE
    deleteReaction: builder.mutation<
      ResponseDto<boolean>,
      { id: number; data: DeleteReactionDto }
    >({
      query: ({ id, data }) => ({
        url: `/reactions/${id}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: (_res, _err, { data }) =>
        invalidateByTarget(data.target),
    }),
  }),
});

export const {
  useGetReactionsQuery,
  useCreateReactionMutation,
  useUpdateReactionMutation,
  useDeleteReactionMutation,
} = reactionApi;

