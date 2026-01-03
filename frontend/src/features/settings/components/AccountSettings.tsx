import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRequestEmailChangeMutation } from '../services/emailChangeApiSlice';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import EditUsernameForm from './forms/EditUsernameForm'; // Import EditUsernameForm

const emailChangeSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
  currentPassword: z.string().min(1, 'Current password is required'),
});

type EmailChangeFormInputs = z.infer<typeof emailChangeSchema>;

const AccountSettings = () => {
  const { user } = useAuth();
  const [showEmailChangeForm, setShowEmailChangeForm] = useState(false);
  const [showUsernameChangeForm, setShowUsernameChangeForm] = useState(false); // New state for username modal
  const [requestEmailChange, { isLoading, isSuccess, isError, error }] =
    useRequestEmailChangeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailChangeFormInputs>({
    resolver: zodResolver(emailChangeSchema),
  });

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Email</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <span className="flex-grow">{user.email}</span>
          <button
            onClick={() => setShowEmailChangeForm(true)}
            className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
        </dd>
      </div>

      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Username</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <span className="flex-grow">{user.username}</span>
          <button
            onClick={() => setShowUsernameChangeForm(true)} // Open username modal
            className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
        </dd>
      </div>

      <Modal open={showEmailChangeForm} onClose={() => setShowEmailChangeForm(false)} title="Change Email">
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              await requestEmailChange(data).unwrap();
              reset();
              setShowEmailChangeForm(false);
            } catch (err) {
              console.error('Failed to request email change:', err);
            }
          })}
          className="mt-4"
        >
          <div className="mb-4">
            <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">
              New Email Address
            </label>
            <Input
              type="email"
              id="newEmail"
              {...register('newEmail')}
              className="mt-1"
            />                      {errors.newEmail && (
              <p className="mt-2 text-sm text-red-600">
                {errors.newEmail.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <Input
              type="password"
              id="currentPassword"
              {...register('currentPassword')}
              className="mt-1"
            />                      {errors.currentPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? 'Sending...' : 'Request Change'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowEmailChangeForm(false);
                reset();
              }}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
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
      </Modal>

      {/* Username Change Modal */}
      <Modal open={showUsernameChangeForm} onClose={() => setShowUsernameChangeForm(false)} title="Change Username">
        <EditUsernameForm
          currentUsername={user.username}
          onClose={() => setShowUsernameChangeForm(false)}
        />
      </Modal>
    </div>);
};

export default AccountSettings;
