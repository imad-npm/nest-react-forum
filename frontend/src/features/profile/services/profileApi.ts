import { apiSlice } from '../../../shared/services/apiSlice';
import type { ResponseDto } from '../../../shared/types';
import type { Profile } from '../types'; // Assuming types.ts defines Profile

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfileByUserId: builder.query<
      ResponseDto<Profile>, // Adjust response type if needed
      number // userId
    >({
      query: (userId) => `/profile/user/${userId}`,
      providesTags: ['Profile'],
    }),
    updateMyProfile: builder.mutation<
      ResponseDto<Profile>,
      Partial<Profile> & { pictureFile?: File }
    >({
      query: ({ pictureFile, ...patch }) => {
        const formData = new FormData();
        if (pictureFile) {
          formData.append('file', pictureFile);
        }
        Object.keys(patch).forEach(key => {
          if (patch[key] !== undefined) {
            formData.append(key, patch[key]);
          }
        });

        return {
          url: `/profile`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['Me', 'Profile'],
    }),
    createMyProfile: builder.mutation<
      ResponseDto<Profile>,
      Partial<Profile> & { pictureFile?: File }
    >({
      query: ({ pictureFile, ...patch }) => {
        const formData = new FormData();
        if (pictureFile) {
          formData.append('file', pictureFile);
        }
        Object.keys(patch).forEach(key => {
          if (patch[key] !== undefined) {
            formData.append(key, patch[key]);
          }
        });

        return {
          url: `/profile`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Me', 'Profile'],
    }),
  }),
});

export const {
  useGetProfileByUserIdQuery,
  useUpdateMyProfileMutation,
  useCreateMyProfileMutation,
} = profileApi;
