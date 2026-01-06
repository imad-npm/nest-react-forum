import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../shared/stores/store';
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from '../services/notificationsApi';
import { setNotifications, setUnreadCount } from '../services/notificationsSlice';
import { INotification } from '../types';

const NotificationItem = ({ notification }: { notification: INotification }) => {
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const dispatch = useDispatch();

  const handleMarkAsRead = () => {
    markAsRead(notification.id);
    dispatch(markAsRead(notification.id));
  };

  return (
    <div
      className={`p-2 border-b ${
        notification.read ? 'bg-white' : 'bg-blue-50'
      }`}
    >
      <p>{notification.actor.username} {notification.type === 'comment' ? 'commented on your post' : 'replied to your comment'}</p>
      <button onClick={handleMarkAsRead} disabled={notification.read}>Mark as read</button>
    </div>
  );
};

const NotificationsDropdown = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const { data, isLoading } = useGetNotificationsQuery({ page: 1, limit: 10 });

  useEffect(() => {
    if (data) {
      dispatch(setNotifications(data.data));
      dispatch(setUnreadCount(data.data.filter(n => !n.read).length));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 text-gray-800 dark:text-gray-200 z-10">
      <div className="p-2 font-bold border-b">Notifications</div>
      {notifications.length === 0 ? (
        <div className="p-2">No notifications</div>
      ) : (
        notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))
      )}
    </div>
  );
};

export default NotificationsDropdown;
