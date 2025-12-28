import { useState } from 'react';
import { BannedUsersQueue } from '../components/BannedUsersQueue';
import { MutedUsersQueue } from '../components/MutedUsersQueue'; // Will create this next

export const ModRestrictionsPage = () => {
  const [activeTab, setActiveTab] = useState('banned-users');

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Moderation Restrictions</h2>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('banned-users')}
            className={`${
              activeTab === 'banned-users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Banned Users
          </button>
          <button
            onClick={() => setActiveTab('muted-users')}
            className={`${
              activeTab === 'muted-users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Muted Users
          </button>
        </nav>
      </div>

      <div className="py-6">
        {activeTab === 'banned-users' && <BannedUsersQueue />}
        {activeTab === 'muted-users' && <MutedUsersQueue />}
      </div>
    </div>
  );
};
