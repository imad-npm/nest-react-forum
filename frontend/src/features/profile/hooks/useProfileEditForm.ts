import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateMyProfileMutation } from '../services/profileApi';
import type { Profile } from '../types';

interface UseProfileEditFormProps {
  currentProfile: Profile;
  onSuccess: () => void;
}

const profileSchema = z.object({
  displayName: z
    .string()
    .min(3, 'Display name must be at least 3 characters.')
    .max(20, 'Display name cannot exceed 20 characters.'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters.').nullable(),
  pictureFile: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const useProfileEditForm = ({
  currentProfile,
  onSuccess,
}: UseProfileEditFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: currentProfile.displayName,
      bio: currentProfile.bio,
    },
  });

  const [updateMyProfile, { isLoading, isSuccess, isError, error }] =
    useUpdateMyProfileMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
    if (isError) {
      console.error('Profile update failed:', error);
    }
  }, [isSuccess, isError, onSuccess, error]);

  const onSubmit = async (data: ProfileFormValues) => {
    const payload: Partial<Profile> & { pictureFile?: File } = {
      displayName: data.displayName,
      bio: data.bio === '' ? null : data.bio,
    };

    if (selectedFile) {
      payload.pictureFile = selectedFile;
    }

    try {
      await updateMyProfile(payload).unwrap();
    } catch (err) {
      // Error handled by useEffect
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return {
    form: {
      register,
      handleSubmit,
      errors,
    },
    submission: {
      onSubmit,
      isLoading,
    },
    file: {
      selectedFile,
      handleFileChange,
    },
  };
};
