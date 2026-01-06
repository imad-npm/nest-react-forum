import { apiSlice } from '../../../shared/services/apiSlice';
import type { INotification } from '../types';
import type { PaginatedResponse, ResponseDto } from '../../../shared/types';

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PaginatedResponse<INotification>, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: '/notifications',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Notifications' as const, id })),
              { type: 'Notifications', id: 'LIST' },
            ]
          : [{ type: 'Notifications', id: 'LIST' }],
    }),
    markNotificationAsRead: builder.mutation<ResponseDto<boolean>, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notifications', id }],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationAsReadMutation } = notificationsApi;
