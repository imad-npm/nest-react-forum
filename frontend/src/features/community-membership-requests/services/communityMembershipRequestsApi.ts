import { apiSlice } from "../../../shared/services/apiSlice";
import type { ResponseDto } from "../../auth/types";
import type { CommunityMembershipQueryDto } from "../../community-memberships/types";
import type { CommunityMembershipRequest, CommunityMembershipRequestQueryDto } from "../types";

export const communityMembershipRequestsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a join request (or auto-join if public)
    createMembershipRequest: builder.mutation<
      ResponseDto<CommunityMembershipRequest>,
      number // communityId
    >({
      query: (communityId) => ({
        url: `/communities/${communityId}/membership-requests`,
        method: 'POST',
      }),
      invalidatesTags: ['CommunityMembershipRequests', 'Communities', 'CommunityMemberships'],
    }),

    // Accept a pending request (admin/mod action, keep requestId for now)
    acceptMembershipRequest: builder.mutation<
      ResponseDto<CommunityMembershipRequest>,
  { communityId: number; userId: number } // pass both IDs
      >({
      query: ({communityId,userId}) => ({
        url: `/communities/${communityId}/membership-requests/${userId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['CommunityMembershipRequests', 'Communities', 'CommunityMemberships'],
    }),

    // Cancel (reject) your own pending request — user-centric, no requestId
    cancelMembershipRequest: builder.mutation<
      ResponseDto<boolean>,
      number // communityId
    >({
      query: (communityId) => ({
        url: `/communities/${communityId}/membership-requests/own`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CommunityMembershipRequests', 'Communities', 'CommunityMemberships'],
    }),

    // 2️⃣ Reject any pending membership request (admin/mod)
    rejectMembershipRequest: builder.mutation<
      ResponseDto<boolean>,
      { communityId: number; userId: number } // target user
    >({
      query: ({ communityId, userId }) => ({
        url: `/communities/${communityId}/membership-requests`,
        method: 'DELETE',
        body: { userId }, // pass target userId in body
      }),
      invalidatesTags: ['CommunityMembershipRequests', 'Communities', 'CommunityMemberships'],
    }),

    // Get all pending requests for a community (admin/mod)
    getCommunityMembershipRequests: builder.query<
      ResponseDto<CommunityMembershipRequest[]>,
CommunityMembershipRequestQueryDto
    >({
      query: ({communityId}) => `/communities/${communityId}/membership-requests`,
      providesTags: ['CommunityMembershipRequests'],
    }),
  }),
});

export const {
  useCreateMembershipRequestMutation,
  useAcceptMembershipRequestMutation,
  useRejectMembershipRequestMutation,
  useCancelMembershipRequestMutation ,
  useGetCommunityMembershipRequestsQuery,
} = communityMembershipRequestsApi;
