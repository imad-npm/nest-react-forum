import React from 'react';
import { Button } from '../../../../shared/components/ui/Button';
import { useUpdateMyProfileMutation } from '../../../profile/services/profileApi';
import { Textarea } from '../../../../shared/components/ui/TextArea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToastContext } from '../../../../shared/providers/ToastProvider'; // Use custom toast

const bioSchema = z.object({
  bio: z.string().max(255, 'Bio must not exceed 255 characters').nullable(),
});

type BioFormInputs = z.infer<typeof bioSchema>;

interface EditBioFormProps {
  currentBio: string | null;
  onClose: () => void;
}

const EditBioForm: React.FC<EditBioFormProps> = ({ currentBio, onClose }) => {
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
  const { showToast } = useToastContext(); // Get showToast from context

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BioFormInputs>({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: currentBio || null,
    },
  });

  const onSubmit = async (data: BioFormInputs) => {
    try {
      if (data.bio === currentBio) {
        showToast('New bio is the same as the current bio.', 'info');
        onClose();
        return;
      }
      await updateProfile({ bio: data.bio }).unwrap();
      showToast('Bio updated successfully!', 'success');
      onClose();
    } catch (err: any) {
      showToast(`Failed to update bio: ${err.data?.message || err.message}`, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <Textarea
          id="bio"
          {...register('bio')}
          className="mt-1 block w-full"
          rows={4}
        />
        {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>}
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

export default EditBioForm;
