import React from 'react';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { useUpdateMyProfileMutation } from '../../../profile/services/profileApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToastContext } from '../../../../shared/providers/ToastProvider'; // Use custom toast

const displayNameSchema = z.object({
  displayName: z.string().min(3, 'Display name must be at least 3 characters').max(50, 'Display name must not exceed 50 characters'),
});

type DisplayNameFormInputs = z.infer<typeof displayNameSchema>;

interface EditDisplayNameFormProps {
  currentDisplayName: string;
  onClose: () => void;
}

const EditDisplayNameForm: React.FC<EditDisplayNameFormProps> = ({
  currentDisplayName,
  onClose,
}) => {
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
  const { showToast } = useToastContext(); // Get showToast from context

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DisplayNameFormInputs>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      displayName: currentDisplayName,
    },
  });

  const onSubmit = async (data: DisplayNameFormInputs) => {
    try {
      if (data.displayName === currentDisplayName) {
        showToast('New display name is the same as the current display name.', 'info');
        onClose();
        return;
      }
      await updateProfile({ displayName: data.displayName }).unwrap();
      showToast('Display name updated successfully!', 'success');
      console.log('Update Display Name Success - Returned Data:', data);
      onClose();
    } catch (err: any) {
      showToast(`Failed to update display name: ${err.data?.message || err.message}`, 'error');
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
          New Display Name
        </label>
        <Input
          type="text"
          id="displayName"
          {...register('displayName')}
          className="mt-1 block w-full"
        />
        {errors.displayName && <p className="mt-2 text-sm text-red-600">{errors.displayName.message}</p>}
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

export default EditDisplayNameForm;
