import React, { useState } from 'react';
import  { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { useUpdateMyProfileMutation } from '../../../profile/services/profileApi';

interface EditDisplayNameFormProps {
  currentDisplayName: string;
  onClose: () => void;
}

const EditDisplayNameForm: React.FC<EditDisplayNameFormProps> = ({
  currentDisplayName,
  onClose,
}) => {
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ displayName }).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to update display name:', err);
      // TODO: Display error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
          Display Name
        </label>
        <Input
          type="text"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 block w-full"
          required
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

export default EditDisplayNameForm;
