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

    deleteMembership: builder.mutation<
      ResponseDto<boolean>,
      number // communityId
    >({
      query: (communityId) => ({
        url: `/users/me/communities/${communityId}/memberships`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CommunityMemberships', 'Communities'],
    }),

    removeCommunityMember: builder.mutation<
      ResponseDto<boolean>,
      { communityId: number; targetUserId: number }
    >({
      query: ({ communityId, targetUserId }) => ({
        url: `/communities/${communityId}/members/${targetUserId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CommunityMemberships', 'Communities'],
    }),
  }),
});

export const {
  useGetCommunityMembershipsQuery,
  useDeleteMembershipMutation,
  useRemoveCommunityMemberMutation,
} = communityMembershipsApi;
