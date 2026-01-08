// useNotificationsSSE.ts
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/stores/hooks';
import { notificationsApi } from '../services/notificationsApi';
import type { INotification, INotificationQueryDto } from '../types'; // Import NotificationQueryDto

export function useNotificationsSSE() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(
    (state) => state.auth.accessToken
  );

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    // Prevent duplicate connections
    if (eventSourceRef.current) return;

    const es = new EventSource(
      `http://localhost:3000/api/notifications/sse?token=${accessToken}`
    );

    eventSourceRef.current = es;
es.onopen = () => {
      console.log('✅ SSE Connected');
    };
    es.onmessage = (event) => {
      const notification: INotification = JSON.parse(event.data);
      console.log('📩 New Notification Received:', event.data);
      // Define query arguments for the getNotifications endpoint
      const queryArgs: INotificationQueryDto = { page: 1, limit: 20 }; // Match the default query for getNotifications

      dispatch(
        notificationsApi.util.updateQueryData(
          'getNotifications',
          { limit: 10 },
          (draft) => {
            if (!draft.pages[0]) return; // no page 1 yet

            const firstPage = draft.pages[0];

            // deduplicate
            if (firstPage.data.some(n => n.id === notification.id)) return;

            firstPage.data.unshift(notification);

            // update meta total
            firstPage.meta.totalItems += 1;

            // optionally trim to page limit
            if (firstPage.data.length > firstPage.meta.limit) {
              firstPage.data.pop();
            }
          }
        )
      );

      dispatch(
        notificationsApi.util.updateQueryData(
          'getUnreadCount',
          undefined,
          (draft) => {
            if (draft.data) {
              draft.data.count += 1;
            }
          }
        )
      );
    };

    es.onerror = () => {
      console.warn('Notifications SSE disconnected');
      es.close();
      eventSourceRef.current = null;
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [accessToken, dispatch]);
}

