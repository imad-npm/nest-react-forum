import { Input } from '../../../shared/components/ui/Input';
import { Textarea } from '../../../shared/components/ui/TextArea';
import { Button } from '../../../shared/components/ui/Button';
import { Label } from '../../../shared/components/ui/Label';
import { useProfileEditForm } from '../hooks/useProfileEditForm';
import type { Profile } from '../types';

interface ProfileEditFormProps {
  currentProfile: Profile;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProfileEditForm = ({
  currentProfile,
  onSuccess,
  onCancel,
}: ProfileEditFormProps) => {
  const { form, submission, file } = useProfileEditForm({
    currentProfile,
    onSuccess,
  });
  const { register, handleSubmit, errors } = form;
  const { onSubmit, isLoading } = submission;
  const { selectedFile, handleFileChange } = file;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register('username')} className="w-full" />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...register('bio')}
          className="w-full"
          rows={5}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
        )}
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
        {selectedFile && (
          <p className="text-sm text-gray-500 mt-1">
            File selected: {selectedFile.name}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
