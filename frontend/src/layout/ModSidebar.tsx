// frontend/src/features/communities/components/ModSidebar.tsx
import { NavLink, useParams } from 'react-router-dom';
import { FaShieldAlt, FaUsers, FaTasks, FaUserShield, FaUserSlash } from 'react-icons/fa';

export const ModSidebar = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const basePath = `/mod/community/${communityId}`;

  const navItems = [
    { label: 'Queues', path: `${basePath}/queues`, icon: <FaTasks /> },
    { label: 'Members', path: `${basePath}/members`, icon: <FaUsers /> },
    { label: 'Moderators', path: `${basePath}/moderators`, icon: <FaUserShield /> },
    { label: 'Restricted Users', path: `${basePath}/restricted-users`, icon: <FaUserSlash /> },
  ];

  return (
    <aside className="w-64 bg-gray-50 h-screen border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-6 px-2 text-gray-700 font-bold">
        <FaShieldAlt className="text-orange-600" />
        <span>Mod Tools</span>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100 text-gray-600'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};