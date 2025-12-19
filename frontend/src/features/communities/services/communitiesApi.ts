import { apiSlice } from '../../../shared/services/apiSlice';
import type { Community, CreateCommunityDto, UpdateCommunityDto, CommunityQueryDto } from '../types';
import type { PaginatedResponse, ResponseDto } from '../../../shared/types';

export const communitiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommunities: builder.query<PaginatedResponse<Community>, CommunityQueryDto>({
      query: (params) => ({
        url: '/communities',
        params,
      }),
      providesTags: ['Communities'],
    }),
    getCommunityById: builder.query<ResponseDto<Community>, number>({
      query: (id) => `/communities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Communities', id }],
    }),
    createCommunity: builder.mutation<ResponseDto<Community>, CreateCommunityDto>({
      query: (newCommunity) => ({
        url: '/communities',
        method: 'POST',
        body: newCommunity,
      }),
      invalidatesTags: ['Communities'],
    }),
    updateCommunity: builder.mutation<ResponseDto<Community>, { id: number; data: UpdateCommunityDto }>({
      query: ({ id, data }) => ({
        url: `/communities/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Communities', id }],
    }),
    deleteCommunity: builder.mutation<ResponseDto<boolean>, number>({
      query: (id) => ({
        url: `/communities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Communities'],
    }),
  }),
});

export const {
  useGetCommunitiesQuery,
  useGetCommunityByIdQuery,
  useCreateCommunityMutation,
  useUpdateCommunityMutation,
  useDeleteCommunityMutation,
} = communitiesApi;
