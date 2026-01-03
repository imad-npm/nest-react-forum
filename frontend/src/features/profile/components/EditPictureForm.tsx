import React, { useState, useRef } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { useUpdateMyProfileMutation, useUpdateMyProfilePictureMutation } from '../services/profileApi';
import { z } from 'zod';
import { useToastContext } from '../../../shared/providers/ToastProvider';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const pictureSchema = z.object({
  pictureFile: z
    .any()
    .refine((file) => file instanceof File || file === null, 'File is required.')
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ).nullable(),
});

type PictureFormInputs = z.infer<typeof pictureSchema>;

interface EditPictureFormProps {
  currentPicture: string | null;
  onClose: () => void;
}

const EditPictureForm: React.FC<EditPictureFormProps> = ({ currentPicture, onClose }) => {
  const [preview, setPreview] = useState<string | null>(currentPicture);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateProfilePicture, { isLoading }] = useUpdateMyProfilePictureMutation();
  const { showToast } = useToastContext(); // Get showToast from context

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationResult = pictureSchema.safeParse({ pictureFile: file });

      if (validationResult.success) {
        setPreview(URL.createObjectURL(file));
      } else {
        showToast(validationResult.error.errors[0].message, 'error');
        // Clear the invalid file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setPreview(currentPicture); // Reset preview to current if validation fails
      }
    } else {
      setPreview(currentPicture);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFile = fileInputRef.current?.files?.[0] || null;

    if (!selectedFile) {
      showToast('No new picture selected.', 'info');
      onClose();
      return;
    }

    const validationResult = pictureSchema.safeParse({ pictureFile: selectedFile });

    if (!validationResult.success) {
      showToast(validationResult.error.errors[0].message, 'error');
      return;
    }

    try {
      await updateProfilePicture({ pictureFile: selectedFile }).unwrap();
      showToast('Profile picture updated successfully!', 'success');
      onClose();
    } catch (err: any) {
      showToast(`Failed to update profile picture: ${err.data?.message || err.message}`, 'error');
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
            ref={fileInputRef}
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
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default EditPictureForm;
