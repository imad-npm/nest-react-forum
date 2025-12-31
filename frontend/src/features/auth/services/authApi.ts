import { apiSlice } from '../../../shared/services/apiSlice';
import type { LoginDto, RegisterDto, UserResponseDto, ResponseDto } from '../types';
import { setAccessToken, logout as authLogout } from '../stores/authSlice'; // Import setAccessToken and rename logout

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ResponseDto<UserResponseDto>, RegisterDto>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Me'],
    }),
    login: builder.mutation<ResponseDto<{ user: UserResponseDto, accessToken: string }>, LoginDto>({
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
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
    logout: builder.mutation<ResponseDto<null>, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Me'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(authLogout());
      },
    }),
    getMe: builder.query<ResponseDto<UserResponseDto>, void>({
      query: () => 'auth/me',
      providesTags: ['Me'],
    }),

    refresh: builder.query<ResponseDto<{ user: UserResponseDto, accessToken: string }>, void>({
      query: () => 'auth/refresh', // This endpoint on the backend uses the HttpOnly cookie to get a new access token and user
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.data.accessToken));
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
    resendEmailVerification: builder.mutation<ResponseDto<null>, { email: string }>({
      query: ({ email }) => ({
        url: 'email-verification/resend',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
});
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useResendEmailVerificationMutation,
} = authApi;
