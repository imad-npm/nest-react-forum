import { useMarkNotificationAsReadMutation } from '../services/notificationsApi';
import type { INotification } from '../types';

const NotificationItem = ({ notification }: { notification: INotification }) => {
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const handleMarkAsRead = () => {
    if (notification.read) return;
    markAsRead(notification.id);
  };

  const getNotificationMessage = (notification: INotification) => {
    const actor = notification.actor?.username ?? 'Someone';

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

  const getResourceLink = (notification: INotification) => {
    if (!notification.resourceType || !notification.resourceId) return '#';

    switch (notification.resourceType) {
      case 'Post':
        return `/posts/${notification.resourceId}`;
      case 'Comment':
        return `/comments/${notification.resourceId}`;
      case 'CommunityMembershipRequest':
        return `/community-membership-requests/${notification.resourceId}`;
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

      {!notification.read && (
        <button
          onClick={handleMarkAsRead}
          className="text-sm text-blue-600"
        >
          Mark as read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
