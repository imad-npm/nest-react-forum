import { apiSlice } from '../../../shared/services/apiSlice';
import type { ResponseDto } from '../../../shared/types';
import type { Profile } from '../types';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get current user's profile
    getMyProfile: builder.query<ResponseDto<Profile>, void>({
      query: () => `/profile`,
      providesTags: ['Me', 'Profile'],
    }),

    // ✅ Get profile by user ID
    getProfileByUserId: builder.query<ResponseDto<Profile>, number>({
      query: (userId) => `/profile/user/${userId}`,
      providesTags: ['Profile'],
    }),

    updateMyProfile: builder.mutation<
      ResponseDto<Profile>,
      Partial<Profile> & { pictureFile?: File }
    >({
      query: ({ pictureFile, ...patch }) => {
        if (pictureFile) {
          const formData = new FormData();
          formData.append('file', pictureFile);

          Object.entries(patch).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });

          return {
            url: '/profile',
            method: 'PATCH',
            body: formData,
          };
        }

        return {
          url: '/profile',
          method: 'PATCH',
          body: patch,
        };
      },
      invalidatesTags: ['Me', 'Profile'],
    }),

    updateMyProfilePicture: builder.mutation<
      ResponseDto<Profile>,
      { pictureFile: File }
    >({
      query: ({ pictureFile }) => {
        const formData = new FormData();
        formData.append('picture', pictureFile);

        return {
          url: '/profile/picture',
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
        if (pictureFile) {
          const formData = new FormData();
          formData.append('file', pictureFile);

          Object.entries(patch).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });

          return {
            url: '/profile',
            method: 'POST',
            body: formData,
          };
        }

        return {
          url: '/profile',
          method: 'POST',
          body: patch,
        };
      },
      invalidatesTags: ['Me', 'Profile'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,             // ✅ Added
  useGetProfileByUserIdQuery,
  useUpdateMyProfileMutation,
  useUpdateMyProfilePictureMutation,
  useCreateMyProfileMutation,
} = profileApi;
