// frontend/src/features/profile/components/ProfileEditForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateMyProfileMutation } from '../services/profileApi';
import type { Profile } from '../types';
import { Input } from '../../../shared/components/ui/Input'; // Assuming an Input component exists
import { Textarea } from '../../../shared/components/ui/TextArea'; // Assuming a TextArea component exists
import { Button } from '../../../shared/components/ui/Button'; // Assuming a Button component exists
import { Label } from '../../../shared/components/ui/Label'; // Assuming a Label component exists

interface ProfileEditFormProps {
  currentProfile: Profile;
  onSuccess: () => void;
  onCancel: () => void;
}

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(50, 'Username cannot exceed 50 characters.'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters.').nullable(),
  pictureFile: z.any().optional(), // For file upload
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileEditForm = ({ currentProfile, onSuccess, onCancel }: ProfileEditFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: currentProfile.username,
      bio: currentProfile.bio,
    },
  });

  const [updateMyProfile, { isLoading, isSuccess, isError, error }] = useUpdateMyProfileMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
    if (isError) {
      // Handle error, e.g., display a toast notification
      console.error('Profile update failed:', error);
    }
  }, [isSuccess, isError, onSuccess, error]);

  const onSubmit = async (data: ProfileFormValues) => {
    const payload: Partial<Profile> & { pictureFile?: File } = {
      username: data.username,
      bio: data.bio === '' ? null : data.bio, // Ensure empty string becomes null for bio
    };

    if (selectedFile) {
      payload.pictureFile = selectedFile;
    }

    try {
      await updateMyProfile(payload).unwrap();
    } catch (err) {
      // Error handled by useEffect, but can add specific form-level error here
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register('username')}
          className="w-full"
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...register('bio')}
          className="w-full"
          rows={5}
        />
        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
      </div>

      <div>
        <Label htmlFor="picture">Profile Picture</Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {selectedFile && <p className="text-sm text-gray-500 mt-1">File selected: {selectedFile.name}</p>}
        {/* Potentially show current picture preview here */}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
