import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';

const MainLayout = () => {

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