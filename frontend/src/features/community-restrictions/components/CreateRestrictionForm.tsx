import { CommunityRestrictionType } from '../types';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { Select, type SelectOption } from '../../../shared/components/ui/Select';
import SearchableSelect from '../../../shared/components/ui/SearchableSelect';
import { Textarea } from '../../../shared/components/ui/TextArea';
import { useCreateRestriction } from '../hooks/useCreateRestriction';

interface CreateRestrictionFormProps {
  communityId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface SearchableUser {
  id: number;
  label: string;
}

export const CreateRestrictionForm = ({
  communityId,
  onSuccess,
  onCancel,
}: CreateRestrictionFormProps) => {
  const { form, members, submission } = useCreateRestriction({
    communityId,
    onSuccess,
  });
  const {
    selectedUser,
    setSelectedUser,
    userSearchTerm,
    setUserSearchTerm,
    restrictionType,
    setRestrictionType,
    reason,
    setReason,
    expiresAt,
    setExpiresAt,
    formError,
  } = form;
  const { isLoadingMembers, filteredMembers } = members;
  const { handleSubmit, isCreating } = submission;

  if (isLoadingMembers) {
    return <div className="p-4">Loading members...</div>;
  }

  const restrictionTypeOptions: SelectOption[] = [
    { value: CommunityRestrictionType.BAN, label: 'Ban' },
    { value: CommunityRestrictionType.MUTE, label: 'Mute' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="user-select">User</Label>
          <SearchableSelect<SearchableUser>
            value={selectedUser ? selectedUser.label : userSearchTerm}
            onSearch={setUserSearchTerm}
            options={filteredMembers}
            onSelect={(user) => {
              setSelectedUser(user);
              setUserSearchTerm(user.label); // Keep the selected user's label in the input
            }}
            getLabel={(user) => user.label}
            placeholder="Search for a user"
            loading={isLoadingMembers}
          />
        </div>

        <div>
          <Label htmlFor="restriction-type-select">Restriction Type</Label>
          <Select
            id="restriction-type-select"
            value={restrictionType}
            onChange={(value) =>
              setRestrictionType(value as CommunityRestrictionType)
            }
            className="w-full"
            options={restrictionTypeOptions}
          />
        </div>

        <div>
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setReason(e.target.value)
            }
            placeholder="Reason for restriction (optional)"
            className="w-full"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="expires-at">Expires At (optional)</Label>
          <Input
            type="datetime-local"
            id="expires-at"
            value={expiresAt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setExpiresAt(e.target.value)
            }
            className="w-full"
          />
        </div>

        {formError && <p className="text-red-500 text-sm">{formError}</p>}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </form>
  );
};
