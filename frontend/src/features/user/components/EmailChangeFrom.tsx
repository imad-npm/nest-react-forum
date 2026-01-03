import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { useRequestEmailChangeMutation } from '../services/emailChangeApiSlice';

const emailChangeSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
  currentPassword: z.string().min(1, 'Current password is required'),
});

export type EmailChangeFormInputs = z.infer<typeof emailChangeSchema>;

interface EmailChangeFormProps {
  onClose: () => void;
}

const EmailChangeForm: React.FC<EmailChangeFormProps> = ({ onClose }) => {
  const [requestEmailChange, { isLoading, isError, isSuccess, error }] =
    useRequestEmailChangeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailChangeFormInputs>({
    resolver: zodResolver(emailChangeSchema),
  });

  const onSubmit = async (data: EmailChangeFormInputs) => {
    try {
      await requestEmailChange(data).unwrap();
      reset();
      onClose();
    } catch (err) {
      console.error('Failed to request email change:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="mb-4">
        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">
          New Email Address
        </label>
        <Input type="email" id="newEmail" {...register('newEmail')} className="mt-1" />
        {errors.newEmail && (
          <p className="mt-2 text-sm text-red-600">{errors.newEmail.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <Input type="password" id="currentPassword" {...register('currentPassword')} className="mt-1" />
        {errors.currentPassword && (
          <p className="mt-2 text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Request Change'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => { reset(); onClose(); }}>
          Cancel
        </Button>
      </div>

      {isSuccess && (
        <p className="mt-2 text-sm text-green-600">
          Verification email sent! Please check your new inbox.
        </p>
      )}
      {isError && (
        <p className="mt-2 text-sm text-red-600">
          Error: {(error as any)?.data?.message || 'Failed to send email change request.'}
        </p>
      )}
    </form>
  );
};

export default EmailChangeForm;
