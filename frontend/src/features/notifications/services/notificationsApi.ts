// notificationsApi.ts
import { apiSlice } from '../../../shared/services/apiSlice';
import type { INotification } from '../types';
import type { PaginatedResponse, ResponseDto } from '../../../shared/types';

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.infiniteQuery<
      PaginatedResponse<INotification>,
      { limit?: number } | void,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, totalPages } = lastPage.meta;
          return page < totalPages ? page + 1 : undefined;
        },
      },

      query: ({ queryArg, pageParam }) => ({
        url: '/notifications',
        params: {
          page: pageParam,
          limit: queryArg?.limit ?? 20,
        },
      }),

      keepUnusedDataFor: 60,
      providesTags: ['Notifications'],
    }),

    markNotificationAsRead: builder.mutation<ResponseDto<boolean>, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsInfiniteQuery,
  useMarkNotificationAsReadMutation,
} = notificationsApi;
