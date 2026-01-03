import { apiSlice } from '../../../shared/services/apiSlice';
import type { ResponseDto, UserResponseDto, UpdateUsernameDto } from '../../auth/types';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   
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
  useUpdateUsernameMutation,
} = userApi;
