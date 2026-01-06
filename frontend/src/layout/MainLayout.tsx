import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { addNotification } from '../features/notifications/services/notificationsSlice';
import { RootState } from '../shared/stores/store';
import EventSource from 'eventsource';

const MainLayout = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const eventSource = new EventSource(
      'http://localhost:3000/api/notifications/sse',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      dispatch(addNotification(notification));
    };

    return () => {
      eventSource.close();
    };
  }, [dispatch, accessToken]);

  return (
    <>
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
};
export default MainLayout;