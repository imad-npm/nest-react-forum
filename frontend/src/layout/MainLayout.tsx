// frontend/src/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';

const MainLayout = () => (
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
export default MainLayout;