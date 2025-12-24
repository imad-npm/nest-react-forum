import { apiSlice } from '../../../shared/services/apiSlice';
import type { CommunityMembership, CommunityMembershipQueryDto } from '../types';
import type { PaginatedResponse, ResponseDto } from '../../../shared/types';

export const communityMembershipsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityMemberships: builder.query<
      PaginatedResponse<CommunityMembership>,
      CommunityMembershipQueryDto
    >({
      query: (params) => ({
        url: '/community-memberships',
        params,
      }),
      providesTags: ['CommunityMemberships'],
    }),
    subscribeToCommunity: builder.mutation<
      ResponseDto<CommunityMembership>,
      number // communityId
    >({
      query: (communityId) => ({
        url: `/communities/${communityId}/memberships`,
        method: 'POST',
      }),
      invalidatesTags: ['CommunityMemberships', 'Communities'], // Invalidate communities to update subscriber count
    }),
    unsubscribeFromCommunity: builder.mutation<
      ResponseDto<boolean>,
      number // communityId
    >({
      query: (communityId) => ({
        url: `/users/me/communities/${communityId}/memberships`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CommunityMemberships', 'Communities'], // Invalidate communities to update subscriber count
    }),
  }),
});

export const {
  useGetCommunityMembershipsQuery,
  useSubscribeToCommunityMutation,
  useUnsubscribeFromCommunityMutation,
} = communityMembershipsApi;
