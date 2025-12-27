import { apiSlice } from "../../../shared/services/apiSlice";
import type { ResponseDto } from "../../auth/types";
import type {
  CommunityRestriction,
  CreateCommunityRestrictionDto,
  UpdateCommunityRestrictionDto,
  CommunityRestrictionQueryDto,
} from "../types";

export const communityRestrictionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch restrictions (supports query params)
    getCommunityRestrictions: builder.query<
      ResponseDto<CommunityRestriction[]>,
      CommunityRestrictionQueryDto
    >({
      query: (params) => ({
        url: `/community-restrictions`,
        params,
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
  useGetCommunityRestrictionsQuery,
  useCreateCommunityRestrictionMutation,
  useUpdateCommunityRestrictionMutation,
  useDeleteCommunityRestrictionMutation,
} = communityRestrictionsApi;
