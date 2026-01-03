import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { useUpdateUsernameMutation } from '../services/userApiSlice';
import { useToastContext } from '../../../shared/providers/ToastProvider';

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters'),
  currentPassword: z.string().min(1, 'Current password is required'),
});

type UsernameFormInputs = z.infer<typeof usernameSchema>;

interface EditUsernameFormProps {
  currentUsername: string;
  onClose: () => void;
}

const EditUsernameForm: React.FC<EditUsernameFormProps> = ({ currentUsername, onClose }) => {
  const { user } = useAuth();
  const [updateUsername, { isLoading }] = useUpdateUsernameMutation();
  const { showToast } = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<UsernameFormInputs>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: currentUsername,
    },
  });

  const onSubmit = async (data: UsernameFormInputs) => {
    try {
      if (data.username === currentUsername) {
        showToast('New username is the same as the current username.', 'info');
        onClose();
        return;
      }

      await updateUsername(data).unwrap();
      showToast('Username updated successfully!', 'success');
      onClose();
    } catch (err: any) {
      const msg = err.data?.message || err.message;
      if (msg === 'Incorrect current password.') {
        setError('currentPassword', { type: 'manual', message: msg });
      } else if (msg === 'Username already taken.') {
        setError('username', { type: 'manual', message: msg });
      } else {
        showToast(`Failed to update username: ${msg}`, 'error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          New Username
        </label>
        <Input id="username" type="text" {...register('username')} className="mt-1 block w-full" />
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
          Update Username
        </Button>
      </div>
    </form>
  );
};

export default EditUsernameForm;
