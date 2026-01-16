import { apiSlice } from '../../../shared/services/apiSlice';
import type { CommunityMembership, CommunityMembershipQueryDto, CommunityRole } from '../types';
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

    updateMemberRole: builder.mutation<
      CommunityMembership, 
      { communityId: number; userId: number; role: CommunityRole }
    >({
      query: ({ communityId, userId, role }) => ({
        url: `/communities/${communityId}/members/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      // Invalidates the list to trigger a UI refresh
          invalidatesTags: ['CommunityMemberships', 'Communities'],

    }),

    deleteOwnMembership: builder.mutation<
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
  useUpdateMemberRoleMutation,
  useDeleteOwnMembershipMutation,
  useRemoveCommunityMemberMutation,
} = communityMembershipsApi;
