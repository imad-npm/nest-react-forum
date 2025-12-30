import { apiSlice } from '../../../shared/services/apiSlice';
import type { LoginDto, RegisterDto, UserResponseDto, ResponseDto } from '../types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ResponseDto<UserResponseDto>, RegisterDto>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<ResponseDto<{ user: UserResponseDto, accessToken: string }>, LoginDto>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<ResponseDto<null>, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<ResponseDto<{ user: UserResponseDto, accessToken: string }>, void>({
      query: () => 'auth/refresh', // This endpoint on the backend uses the HttpOnly cookie to get a new access token and user
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
export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetProfileQuery, useResendEmailVerificationMutation } = authApi;
