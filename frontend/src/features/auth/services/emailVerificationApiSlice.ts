import { apiSlice } from '../../../shared/services/apiSlice';
import type { ResponseDto } from '../types';

export const emailVerificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  useResendEmailVerificationMutation,
} = emailVerificationApi;
