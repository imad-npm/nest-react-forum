// useNotificationsSSE.ts
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/stores/hooks';
import { notificationsApi } from '../services/notificationsApi';
import type { INotification } from '../types';

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

    es.onmessage = (event) => {
      const notification: INotification = JSON.parse(event.data);

      dispatch(
        notificationsApi.util.updateQueryData(
          'getNotifications',
          { page: 1, limit: 20 },
          (draft) => {
            if (draft.data.some((n) => n.id === notification.id)) return;

            draft.data.unshift(notification);
            draft.meta.totalItems += 1;

            if (draft.data.length > 20) {
              draft.data.pop();
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
