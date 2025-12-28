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
      providesTags: (result, error, userId) => [{ type: 'Profile', id: userId }],
    }),
    getMyProfile: builder.query<
      ResponseDto<Profile>, // Adjust response type if needed
      void
    >({
      query: () => `/profile`,
      providesTags: ['MyProfile'],
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
          // If you're sending FormData, ensure content-type is not set to application/json
          // 'Content-Type': 'multipart/form-data', // This is usually set automatically by the browser
        };
      },
      invalidatesTags: ['MyProfile'],
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
      invalidatesTags: ['MyProfile'],
    }),
  }),
});

export const {
  useGetProfileByUserIdQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useCreateMyProfileMutation,
} = profileApi;
