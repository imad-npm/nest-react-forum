import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginDto, RegisterDto, UserResponseDto, ResponseDto } from '../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  endpoints: (builder) => ({
    register: builder.mutation<ResponseDto<UserResponseDto>, RegisterDto>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<ResponseDto<{ user: UserResponseDto, accessToken: string, refreshToken: string }>, LoginDto>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    refresh: builder.mutation<ResponseDto<{ user: UserResponseDto, accessToken: string, refreshToken: string }>, { refreshToken: string }>({
        query: ({refreshToken}) => ({
            url: 'auth/refresh',
            method: 'POST',
            body: {refreshToken}
        })
    })
  }),
});
export const { useRegisterMutation, useLoginMutation, useRefreshMutation } = authApi;
