import React, { useState } from 'react';
import  { Button } from '../../../../shared/components/ui/Button';
import { useUpdateMyProfileMutation } from '../../../profile/services/profileApi';
import { Textarea } from '../../../../shared/components/ui/TextArea';

interface EditBioFormProps {
  currentBio: string | null;
  onClose: () => void;
}

const EditBioForm: React.FC<EditBioFormProps> = ({ currentBio, onClose }) => {
  const [bio, setBio] = useState(currentBio || '');
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ bio }).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to update bio:', err);
      // TODO: Display error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 block w-full"
          rows={4}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditBioForm;
