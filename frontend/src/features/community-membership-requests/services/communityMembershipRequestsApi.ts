import { apiSlice } from "../../../shared/services/apiSlice";
import type { ResponseDto } from "../../auth/types";
import type { CommunityMembershipRequest } from "../types";

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
      number // requestId
    >({
      query: (requestId) => ({
        url: `/communities/membership-requests/${requestId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['CommunityMembershipRequests', 'Communities', 'CommunityMemberships'],
    }),

    // Cancel (reject) your own pending request — user-centric, no requestId
    rejectMembershipRequest: builder.mutation<
      ResponseDto<boolean>,
      number // communityId
    >({
      query: (communityId) => ({
        url: `/communities/${communityId}/membership-requests`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CommunityMembershipRequests', 'Communities', 'CommunityMemberships'],
    }),

    // Get all pending requests for a community (admin/mod)
    getCommunityMembershipRequests: builder.query<
      ResponseDto<CommunityMembershipRequest[]>,
      number // communityId
    >({
      query: (communityId) => `/communities/${communityId}/membership-requests`,
      providesTags: ['CommunityMembershipRequests'],
    }),
  }),
});

export const {
  useCreateMembershipRequestMutation,
  useAcceptMembershipRequestMutation,
  useRejectMembershipRequestMutation,
  useGetCommunityMembershipRequestsQuery,
} = communityMembershipRequestsApi;
