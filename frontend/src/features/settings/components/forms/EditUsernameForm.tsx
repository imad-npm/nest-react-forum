import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../../shared/components/ui/Input';
import { Button } from '../../../../shared/components/ui/Button';
import { useUpdateUsernameMutation } from '../../../auth/services/authApi';
import { useAuth } from '../../../auth/hooks/useAuth';

const usernameSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must not exceed 20 characters'),
  currentPassword: z.string().min(1, 'Current password is required'),
});

type UsernameFormInputs = z.infer<typeof usernameSchema>;

interface EditUsernameFormProps {
  currentUsername: string;
  onClose: () => void;
}

const EditUsernameForm: React.FC<EditUsernameFormProps> = ({ currentUsername, onClose }) => {
  const { user } = useAuth();
  const [updateUsername, { isLoading, isError, isSuccess, error }] = useUpdateUsernameMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<UsernameFormInputs>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: currentUsername,
    },
  });

  const onSubmit = async (data: UsernameFormInputs) => {
    try {
      if (data.username === currentUsername) {
        toast.info('New username is the same as the current username.');
        onClose();
        return;
      }
      await updateUsername(data).unwrap();
      toast.success('Username updated successfully!');
      onClose();
    } catch (err: any) {
      if (err.data?.message === 'Incorrect current password.') {
        setError('currentPassword', { type: 'manual', message: err.data.message });
      } else if (err.data?.message === 'Username already taken.') {
        setError('username', { type: 'manual', message: err.data.message });
      } else {
        toast.error(`Failed to update username: ${err.data?.message || err.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          New Username
        </label>
        <Input
          id="username"
          type="text"
          {...register('username')}
          className="mt-1 block w-full"
        />
        {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <Input
          id="currentPassword"
          type="password"
          {...register('currentPassword')}
          className="mt-1 block w-full"
        />
        {errors.currentPassword && <p className="mt-2 text-sm text-red-600">{errors.currentPassword.message}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Username'}
        </Button>
      </div>
    </form>
  );
};

export default EditUsernameForm;
