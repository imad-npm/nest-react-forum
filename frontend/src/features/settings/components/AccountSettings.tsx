import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

const AccountSettings = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Email</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <span className="flex-grow">{user.email}</span>
          <button className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Edit
          </button>
        </dd>
      </div>
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Username</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <span className="flex-grow">{user.username}</span>
          <button className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Edit
          </button>
        </dd>
      </div>
    </div>
  );
};

export default AccountSettings;
