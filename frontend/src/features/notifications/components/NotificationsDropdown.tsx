import { Button } from '../../../shared/components/ui/Button';
import { useGetNotificationsInfiniteQuery } from '../services/notificationsApi';
import NotificationItem from './NotificationsItem';

const NotificationsDropdown = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetNotificationsInfiniteQuery({ limit: 10 });

  // 🔑 Flatten pages
  const notifications =
    data?.pages.flatMap((page) => page.data) ?? [];

    console.log(notifications);
    
  // 🔑 Derived unread count (no Redux slice)
  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return <div className="p-2">Loading...</div>;
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10">
      <div className="p-2 font-bold border-b">
        Notifications {unreadCount > 0 && `(${unreadCount})`}
      </div>

      {notifications.length === 0 ? (
        <div className="p-2">No notifications</div>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))
      )}

      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </div>
  );
};

export default NotificationsDropdown;
