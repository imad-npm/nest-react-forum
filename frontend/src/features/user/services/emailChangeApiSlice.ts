import { apiSlice } from '../../../shared/services/apiSlice';

export const emailChangeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestEmailChange: builder.mutation<
      { message: string },
      { newEmail: string; currentPassword: string }
    >({
      query: (body) => ({
        url: '/email/change/request',
        method: 'POST',
        body,
      }),
    }),
    verifyEmailChange: builder.mutation<{ message: string }, { token: string }>({
      query: ({ token }) => ({
        url: `/email/change/verify?token=${token}`,
        method: 'GET',

      }),
      invalidatesTags: ['Me'],

    }),

  }),

});

export const { useRequestEmailChangeMutation, useVerifyEmailChangeMutation } =
  emailChangeApiSlice;
