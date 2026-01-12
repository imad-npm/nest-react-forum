import { apiSlice } from '../../../shared/services/apiSlice';
import type { PaginatedResponse, ResponseDto } from '../../../shared/types';
import type {
  Reaction,
  CreateReactionDto,
  UpdateReactionDto,
  ReactionQueryDto,
  Reactable,
} from '../types/types';

// Helper to invalidate related cache
const invalidateByTarget = (target: Reactable) => [
  { type: 'Reactions' as const },
  target === 'post' ? { type: 'Posts' as const } : { type: 'Comments' as const },
];

export const reactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // LIST
    getReactions: builder.query<PaginatedResponse<Reaction>, ReactionQueryDto>({
      query: (params) => ({
        url: '/reactions',
        params,
      }),
      providesTags: ['Reactions'],
    }),

    // CREATE
    createReaction: builder.mutation<ResponseDto<Reaction>, CreateReactionDto>({
      query: (body) => ({
        url: '/reactions',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, { reactableType }) => invalidateByTarget(reactableType),
    }),

    // UPDATE
    updateReaction: builder.mutation<
      ResponseDto<Reaction>,
      {
        id: number; data: UpdateReactionDto;
        reactableType: Reactable
      }
    >({
      query: ({ id, data }) => ({
        url: `/reactions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      // no need to invalidate by reactableType here because type update doesn't change parent
      invalidatesTags: (_res, _err, { reactableType }) => invalidateByTarget(reactableType),
    }),

    // DELETE
    deleteReaction: builder.mutation<
      ResponseDto<boolean>,
      { id: number; reactableType: Reactable }
    >({
      query: ({ id }) => ({
        url: `/reactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { reactableType }) => invalidateByTarget(reactableType),
    }),
  })
})
export const {
  useGetReactionsQuery,
  useCreateReactionMutation,
  useUpdateReactionMutation,
  useDeleteReactionMutation,
} = reactionApi;
