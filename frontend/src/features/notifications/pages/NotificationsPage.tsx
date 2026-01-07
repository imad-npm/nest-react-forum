import React, { useState } from 'react';
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation } from '../services/notificationsApi';
import { INotification, NotificationType } from '../types';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { Button } from '../../../shared/components/ui/Button';
import { Spinner } from '../../../shared/components/ui/Spinner';

export const NotificationsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useGetNotificationsQuery({ page, limit: 10 });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead(notificationId);
    refetch(); // Refetch to update the list
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch(); // Refetch to update the list
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error?.toString()}</div>;
  }

  const notifications = data?.data || [];
  const meta = data?.meta;

  const getNotificationMessage = (notification: INotification) => {
    const { actor, type, resourceType, resourceId } = notification;
    const actorName = actor?.username || 'Someone';

    switch (type) {
      case NotificationType.NEW_POST:
        return `${actorName} created a new post.`;
      case NotificationType.NEW_COMMENT:
        return `${actorName} commented on your ${resourceType?.toLowerCase()}.`;
      case NotificationType.NEW_REPLY_COMMENT:
        return `${actorName} replied to your comment.`;
      case NotificationType.POST_REACTION:
        return `${actorName} reacted to your post.`;
      case NotificationType.COMMENT_REACTION:
        return `${actorName} reacted to your comment.`;
      case NotificationType.COMMUNITY_MEMBERSHIP_REQUEST:
        return `${actorName} requested to join your community.`;
      case NotificationType.COMMUNITY_MEMBERSHIP_ACCEPTED:
        return `${actorName} accepted your community membership request.`;
      case NotificationType.COMMUNITY_MEMBERSHIP_REJECTED:
        return `${actorName} rejected your community membership request.`;
      default:
        return `New notification from ${actorName}.`;
    }
  };

  const getNotificationLink = (notification: INotification) => {
    const { resourceType, resourceId } = notification;
    switch (resourceType) {
      case 'Post':
        return `/posts/${resourceId}`;
      case 'Comment':
        // Assuming comments are nested within posts, this might need refinement to link to the specific comment
        return `/posts/${notification.resourceId}`; // Temporarily link to post, refine later if needed
      case 'CommunityMembershipRequest':
        return `/mod/community/${resourceId}/queues`;
      default:
        return '#';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <Button onClick={handleMarkAllAsRead} disabled={isLoading}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-lg shadow-md flex items-center justify-between ${notification.read ? 'bg-gray-100' : 'bg-blue-50'
                }`}
            >
              <Link to={getNotificationLink(notification)} className="flex-grow">
                <p className="font-semibold">{getNotificationMessage(notification)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </Link>
              <Button
                onClick={() => handleMarkAsRead(notification.id)}
                disabled={notification.read || isLoading}
                variant="ghost"
                className="ml-4"
                title={notification.read ? 'Already Read' : 'Mark as Read'}
              >
                {notification.read ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaRegCircle className="text-gray-400" />
                )}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              onClick={() => setPage(p)}
              disabled={p === page || isLoading}
              variant={p === page ? 'solid' : 'outline'}
            >
              {p}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
