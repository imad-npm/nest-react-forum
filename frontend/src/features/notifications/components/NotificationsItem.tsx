import { useMarkNotificationAsReadMutation } from '../services/notificationsApi';
import type { INotification } from '../types';
import { NotificationType } from '../types';

const NotificationItem = ({ notification }: { notification: INotification }) => {
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const handleMarkAsRead = () => {
    if (notification.read) return;
    markAsRead(notification.id);
  };

  const getNotificationMessage = (notification: INotification) => {
    const actor = notification.actor?.username ?? 'Someone';

    switch (notification.type) {
      case NotificationType.NEW_COMMENT:
        return `${actor} commented on your post.`;

      case NotificationType.NEW_POST:
        return `${actor} created a new post in your community.`;

      case NotificationType.POST_REACTION:
        return `${actor} reacted to your post.`;

      case NotificationType.COMMENT_REACTION:
        return `${actor} reacted to your comment.`;

      case NotificationType.COMMUNITY_MEMBERSHIP_REQUEST:
        return `${actor} sent a membership request to your community.`;

      case NotificationType.COMMUNITY_MEMBERSHIP_ACCEPTED:
        return `Your membership request was accepted.`;

      case NotificationType.COMMUNITY_MEMBERSHIP_REJECTED:
        return `Your membership request was rejected.`;

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
