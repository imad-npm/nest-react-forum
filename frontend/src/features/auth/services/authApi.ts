import { apiSlice } from '../../../shared/services/apiSlice';
import type { LoginDto, RegisterDto, UserResponseDto, ResponseDto } from '../types';
import { setAccessToken } from '../stores/authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
     getMe: builder.query<ResponseDto<UserResponseDto>, void>({
          query: () => 'auth/me',
          providesTags: ['Me'],
        }),
    register: builder.mutation<ResponseDto<UserResponseDto>, RegisterDto>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Me'],
    }),
    login: builder.mutation<ResponseDto<{ user: UserResponseDto; accessToken: string }>, LoginDto>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Me'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.data.accessToken));
        } catch {}
      },
    }),
    logout: builder.mutation<ResponseDto<null>, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Me'],
    }),
    refresh: builder.query<ResponseDto<{ user: UserResponseDto; accessToken: string }>, void>({
      query: () => 'auth/refresh',
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.data.accessToken));
        } catch {}
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshQuery,
  useGetMeQuery
} = authApi;
