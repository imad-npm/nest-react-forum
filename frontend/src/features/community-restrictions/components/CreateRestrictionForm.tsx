import { useState } from 'react';
import { CommunityRestrictionType } from '../types';
import { useGetCommunityMembershipsQuery } from '../../community-memberships/services/communityMembershipsApi';
import type { CommunityMembershipQueryDto } from '../../community-memberships/types';
import { useCreateCommunityRestrictionMutation } from '../services/communityRestrictionsApi';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { Select, type SelectOption } from '../../../shared/components/ui/Select';
import SearchableSelect from '../../../shared/components/ui/SearchableSelect';
import { Textarea } from '../../../shared/components/ui/TextArea';

interface CreateRestrictionFormProps {
  communityId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface SearchableUser {
  id: number;
  label: string;
}

export const CreateRestrictionForm = ({ communityId, onSuccess, onCancel }: CreateRestrictionFormProps) => {
  const [selectedUser, setSelectedUser] = useState<SearchableUser | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [restrictionType, setRestrictionType] = useState<CommunityRestrictionType>(CommunityRestrictionType.BAN);
  const [reason, setReason] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const communityMembershipsQueryParams: CommunityMembershipQueryDto = {
    communityId: communityId,
    limit: 100,
  };
  const { data: membersResponse, isLoading: isLoadingMembers } = useGetCommunityMembershipsQuery(communityMembershipsQueryParams);
  const [createRestriction, { isLoading: isCreating }] = useCreateCommunityRestrictionMutation();
console.log(expiresAt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedUser) {
      setFormError('Please select a user.');
      return;
    }
console.log(expiresAt);

    try {
      await createRestriction({
        communityId,
        userId: selectedUser.id,
        restrictionType,
        reason: reason || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      }).unwrap();
      onSuccess();
    } catch (err: any) {
      setFormError(err.data?.message || 'Failed to create restriction.');
    }
  };

  if (isLoadingMembers) {
    return <div className="p-4">Loading members...</div>;
  }

  const allMembers = membersResponse?.data || [];
  const searchableMembers: SearchableUser[] = allMembers.map(member => ({
    id: member.userId,
    label: `User ID: ${member.userId}`
  }));

  const filteredMembers = searchableMembers.filter(member =>
    member.label.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

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
            onChange={(value) => setRestrictionType(value as CommunityRestrictionType)}
            className="w-full"
            options={restrictionTypeOptions}
          />
        </div>

        <div>
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpiresAt(e.target.value)}
            className="w-full"
          />
        </div>

        {formError && <p className="text-red-500 text-sm">{formError}</p>}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isCreating}>
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
