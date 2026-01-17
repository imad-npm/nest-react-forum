import { apiSlice } from "../../../shared/services/apiSlice";
import type { ResponseDto } from "../../auth/types";
import type { PaginatedResponse } from "../../comments/types";
import type {
  CommunityRestriction,
  CreateCommunityRestrictionDto,
  UpdateCommunityRestrictionDto,
  CommunityRestrictionQueryDto,
} from "../types";

export const communityRestrictionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch restrictions (supports query params)
    getCommunityRestrictions: builder.infiniteQuery<
      PaginatedResponse<CommunityRestriction>,
      CommunityRestrictionQueryDto,number
    >({

        infiniteQueryOptions: {
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  },
       query: ({ queryArg, pageParam = 1 }) => ({
        url: `/community-restrictions`,
        // merge original query args and the page parameter
        params: { ...(queryArg ?? {}), page: pageParam },
      }),
      providesTags: ['CommunityRestrictions'],
    }),

    // Create a restriction
    createCommunityRestriction: builder.mutation<
      ResponseDto<CommunityRestriction>,
      CreateCommunityRestrictionDto
    >({
      query: (body) => ({
        url: `/community-restrictions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CommunityRestrictions'],
    }),

    // Update a restriction
    updateCommunityRestriction: builder.mutation<
      ResponseDto<CommunityRestriction>,
      { id: number; body: UpdateCommunityRestrictionDto }
    >({
      query: ({ id, body }) => ({
        url: `/community-restrictions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['CommunityRestrictions'],
    }),

    // Delete a restriction
    deleteCommunityRestriction: builder.mutation<
      ResponseDto<boolean>,
      number // id
    >({
      query: (id) => ({
        url: `/community-restrictions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CommunityRestrictions'],
    }),
  }),
});

export const {
  useGetCommunityRestrictionsInfiniteQuery,
  useCreateCommunityRestrictionMutation,
  useUpdateCommunityRestrictionMutation,
  useDeleteCommunityRestrictionMutation,
} = communityRestrictionsApi;
