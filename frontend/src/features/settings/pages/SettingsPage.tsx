import React from 'react';
import Tabs from '../components/Tabs';
import ProfileSettings from '../components/ProfileSettings';
import AccountSettings from '../components/AccountSettings';

const SettingsPage = () => {
  const tabs = [
    {
      label: 'Account',
      content: <AccountSettings />,
    },
    {
      label: 'Profile',
      content: <ProfileSettings />,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">User Settings</h1>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SettingsPage;
