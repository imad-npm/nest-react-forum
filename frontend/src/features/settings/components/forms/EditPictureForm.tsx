import React, { useState } from 'react';
import  { Button } from '../../../../shared/components/ui/Button';
import { useUpdateMyProfileMutation } from '../../../profile/services/profileApi';

interface EditPictureFormProps {
  currentPicture: string | null;
  onClose: () => void;
}

const EditPictureForm: React.FC<EditPictureFormProps> = ({ currentPicture, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentPicture);
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreview(currentPicture);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      console.warn('No file selected.');
      return;
    }

    try {
      await updateProfile({ pictureFile: selectedFile }).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to update profile picture:', err);
      // TODO: Display error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
          Profile Picture
        </label>
        <div className="mt-1 flex items-center space-x-4">
          {preview && (
            <img src={preview} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover" />
          )}
          <input
            type="file"
            id="picture"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={!selectedFile}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditPictureForm;
