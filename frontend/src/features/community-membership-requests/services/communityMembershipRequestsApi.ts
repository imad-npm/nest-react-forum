import { apiSlice } from "../../../shared/services/apiSlice";
import type { ResponseDto } from "../../auth/types";
import type { CommunityMembershipRequest } from "../types";

export const communityMembershipRequestsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMembershipRequest: builder.mutation<
      ResponseDto<CommunityMembershipRequest>,
      number // communityId
    >({
      query: (communityId) => ({
        url: `/community-membership-requests/${communityId}`,
        method: 'POST',
      }),
invalidatesTags: ['CommunityMembershipRequests', 'Communities'],    }),
    acceptMembershipRequest: builder.mutation<
      ResponseDto<CommunityMembershipRequest>,
      number // requestId
    >({
      query: (requestId) => ({
        url: `/community-membership-requests/${requestId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['CommunityMembershipRequests', 'CommunityMemberships'],
    }),
    rejectMembershipRequest: builder.mutation<
      ResponseDto<boolean>,
      number // requestId
    >({
      query: (requestId) => ({
        url: `/community-membership-requests/${requestId}/reject`,
        method: 'DELETE',
      }),
invalidatesTags: ['CommunityMembershipRequests', 'Communities'],    }),
    getCommunityMembershipRequests: builder.query<
      ResponseDto<CommunityMembershipRequest[]>,
      number // communityId
    >({
      query: (communityId) => `/community-membership-requests/community/${communityId}`,
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
