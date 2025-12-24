import { apiSlice } from '../../../shared/services/apiSlice';
import type { CommunityMembership, CommunitySubscriptionQueryDto } from '../types';
import type { PaginatedResponse, ResponseDto } from '../../../shared/types';

export const communitySubscriptionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommunitySubscriptions: builder.query<
      PaginatedResponse<CommunityMembership>,
      CommunitySubscriptionQueryDto
    >({
      query: (params) => ({
        url: '/community-memberships',
        params,
      }),
      providesTags: ['CommunitySubscriptions'],
    }),
    subscribeToCommunity: builder.mutation<
      ResponseDto<CommunityMembership>,
      number // communityId
    >({
      query: (communityId) => ({
        url: `/communities/${communityId}/subscriptions`,
        method: 'POST',
      }),
      invalidatesTags: ['CommunitySubscriptions', 'Communities'], // Invalidate communities to update subscriber count
    }),
    unsubscribeFromCommunity: builder.mutation<
      ResponseDto<boolean>,
      number // communityId
    >({
      query: (communityId) => ({
        url: `/users/me/communities/${communityId}/subscriptions`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CommunitySubscriptions', 'Communities'], // Invalidate communities to update subscriber count
    }),
  }),
});

export const {
  useGetCommunitySubscriptionsQuery,
  useSubscribeToCommunityMutation,
  useUnsubscribeFromCommunityMutation,
} = communitySubscriptionsApi;
