import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../shared/stores/store';
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from '../services/notificationsApi';
import { setNotifications, setUnreadCount } from '../services/notificationsSlice';
import type { INotification } from '../types';

const NotificationItem = ({ notification }: { notification: INotification }) => {
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const dispatch = useDispatch();

  const handleMarkAsRead = () => {
    markAsRead(notification.id);

  };

  const getNotificationMessage = (notification: INotification) => {
    const actor = notification.actor?.username || 'Someone'; // Fallback if actor is not available

    switch (notification.type) {
      case 'comment':
        return `${actor} commented on your post.`;
      case 'reply':
        return `${actor} replied to your comment.`;
      case 'post_reaction':
        return `${actor} reacted to your post.`;
      case 'comment_reaction':
        return `${actor} reacted to your comment.`;
      case 'community_membership_request':
        return `${actor} sent a membership request to your community.`;
      case 'post_created':
        return `${actor} created a new post in your community.`;
      default:
        return 'You have a new notification.';
    }
  };

  // Function to generate a link based on resourceType and resourceId
  const getResourceLink = (notification: INotification) => {
    if (!notification.resourceType || !notification.resourceId) {
      return '#'; // No specific link
    }

    switch (notification.resourceType) {
      case 'Post':
        return `/posts/${notification.resourceId}`;
      case 'Comment':
        // For comments, we might want to link to the post and scroll to the comment
        return `/comments/${notification.resourceId}`; // This would navigate to a specific comment's page or section
      case 'CommunityMembershipRequest':
        return `/community-membership-requests/${notification.resourceId}`;
      // Add other cases for other resource types
      default:
        return '#';
    }
  };

  return (
    <div
      className={`p-2 border-b ${
        notification.read ? 'bg-white' : 'bg-blue-50'
      }`}
    >
      <a href={getResourceLink(notification)} className="block">
        <p>{getNotificationMessage(notification)}</p>
      </a>
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
