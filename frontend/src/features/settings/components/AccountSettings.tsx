import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Modal } from '../../../shared/components/ui/Modal';
import EditUsernameForm from '../../user/components/EditUsernameForm';
import EmailChangeForm from '../../user/components/EmailChangeFrom';

const AccountSettings = () => {
  const { user } = useAuth();
  const [showEmailChangeForm, setShowEmailChangeForm] = useState(false);
  const [showUsernameChangeForm, setShowUsernameChangeForm] = useState(false);

  if (!user) return <div>Loading user...</div>;

  return (
    <div>
      {/* Email Section */}
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Email</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <span className="flex-grow">{user.email}</span>
          <button
            onClick={() => setShowEmailChangeForm(true)}
            className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
        </dd>
      </div>

      {/* Username Section */}
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Username</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <span className="flex-grow">{user.username}</span>
          <button
            onClick={() => setShowUsernameChangeForm(true)}
            className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
        </dd>
      </div>

      {/* Email Change Modal */}
      <Modal
        open={showEmailChangeForm}
        onClose={() => setShowEmailChangeForm(false)}
      >
        <EmailChangeForm onClose={() => setShowEmailChangeForm(false)} />
      </Modal>

      {/* Username Change Modal */}
      <Modal
        open={showUsernameChangeForm}
        onClose={() => setShowUsernameChangeForm(false)}
      >
        <EditUsernameForm
          currentUsername={user.username}
          onClose={() => setShowUsernameChangeForm(false)}
        />
      </Modal>
    </div>
  );
};

export default AccountSettings;
