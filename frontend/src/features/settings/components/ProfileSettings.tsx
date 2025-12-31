import React, { useState } from 'react';
import { useProfile } from '../../profile/hooks/useProfile';
import { Modal } from '../../../shared/components/ui/Modal';
import EditDisplayNameForm from './forms/EditDisplayNameForm';
import EditBioForm from './forms/EditBioForm';
import EditPictureForm from './forms/EditPictureForm';

const ProfileSettings = () => {
  const profile = useProfile();
  const [isDisplayNameModalOpen, setIsDisplayNameModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);


  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Display Name</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <span className="flex-grow">{profile.displayName}</span>
          <button
            onClick={() => setIsDisplayNameModalOpen(true)}
            className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
        </dd>
      </div>
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Bio</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <span className="flex-grow">{profile.bio}</span>
          <button
            onClick={() => setIsBioModalOpen(true)}
            className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
        </dd>
      </div>
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Picture</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <span className="flex-grow">
            <img src={profile.picture} alt="Profile" className="w-10 h-10 rounded-full" />
          </span>
          <button
            onClick={() => setIsPictureModalOpen(true)}
            className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
        </dd>
      </div>

      <Modal open={isDisplayNameModalOpen} onClose={() => setIsDisplayNameModalOpen(false)} title="Edit Display Name">
        <EditDisplayNameForm
          currentDisplayName={profile.displayName}
          onClose={() => setIsDisplayNameModalOpen(false)}
        />
      </Modal>

      <Modal open={isBioModalOpen} onClose={() => setIsBioModalOpen(false)} title="Edit Bio">
        <EditBioForm
          currentBio={profile.bio}
          onClose={() => setIsBioModalOpen(false)}
        />
      </Modal>

      <Modal open={isPictureModalOpen} onClose={() => setIsPictureModalOpen(false)} title="Edit Profile Picture">
        <EditPictureForm
          currentPicture={profile.picture}
          onClose={() => setIsPictureModalOpen(false)}
        />
      </Modal>


    </div>
  );
};

export default ProfileSettings;
