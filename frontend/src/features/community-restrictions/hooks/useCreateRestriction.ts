import { useState } from 'react';
import { CommunityRestrictionType } from '../types';
import { useGetCommunityMembershipsQuery } from '../../community-memberships/services/communityMembershipsApi';
import type { CommunityMembershipQueryDto } from '../../community-memberships/types';
import { useCreateCommunityRestrictionMutation } from '../services/communityRestrictionsApi';

interface UseCreateRestrictionProps {
  communityId: number;
  onSuccess: () => void;
}

interface SearchableUser {
  id: number;
  label: string;
}

export const useCreateRestriction = ({
  communityId,
  onSuccess,
}: UseCreateRestrictionProps) => {
  const [selectedUser, setSelectedUser] = useState<SearchableUser | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [restrictionType, setRestrictionType] =
    useState<CommunityRestrictionType>(CommunityRestrictionType.BAN);
  const [reason, setReason] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const communityMembershipsQueryParams: CommunityMembershipQueryDto = {
    communityId: communityId,
    limit: 100,
  };
  const { data: membersResponse, isLoading: isLoadingMembers } =
    useGetCommunityMembershipsQuery(communityMembershipsQueryParams);

  const [createRestriction, { isLoading: isCreating }] =
    useCreateCommunityRestrictionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedUser) {
      setFormError('Please select a user.');
      return;
    }

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

  const allMembers = membersResponse?.data ?? [];
  const searchableMembers: SearchableUser[] = allMembers.map((member) => ({
    id: member.userId,
    label: member.user.username,
  }));

  const filteredMembers = searchableMembers.filter((member) =>
    member.label.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return {
    form: {
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
    },
    members: {
      isLoadingMembers,
      filteredMembers,
    },
    submission: {
      handleSubmit,
      isCreating,
    },
  };
};
