import { useGetNotificationsInfiniteQuery } from '../services/notificationsApi';
import NotificationItem from '../components/NotificationsItem';
import { Button } from '../../../shared/components/ui/Button';

const NotificationsPage = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetNotificationsInfiniteQuery({ limit: 10 });

  const notifications =
    data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="p-2">No notifications</div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}

      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4"
        >
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </div>
  );
};

export default NotificationsPage;