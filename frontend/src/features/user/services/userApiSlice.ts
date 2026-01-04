import { apiSlice } from '../../../shared/services/apiSlice';
import type { ResponseDto, UserResponseDto, UpdateUsernameDto } from '../../auth/types';
import type { PaginatedResponse } from '../../../shared/types';
import type { UserQueryDto } from '../types';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<UserResponseDto>, UserQueryDto>({
      query: (params) => ({
        url: 'users',
        params,
      }),
      providesTags: ['Users'],
    }),
    updateUsername: builder.mutation<ResponseDto<UserResponseDto>, UpdateUsernameDto>({
      query: (dto) => ({
        url: 'users/me',
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Me'],
    }),
  }),
});
    

export const {
  useGetUsersQuery,
  useUpdateUsernameMutation,
} = userApi;
