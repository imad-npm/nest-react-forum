// frontend/src/features/communities/layouts/ModLayout.tsx
import { Outlet } from 'react-router-dom';
import { ModSidebar } from './ModSidebar';
import Header from './Header';

const ModLayout = () => (
  <>
    <Header />
    <div className="flex min-h-screen bg-white">
      <ModSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  </>
);
export default ModLayout;