import { useParams } from 'react-router-dom';
import {
  useGetCommunityMembershipsQuery,
  useUpdateMemberRoleMutation,
} from '../services/communityMembershipsApi';
import { useAuth } from '../../auth/hooks/useAuth';
import type { User, CommunityMembership } from '../types';
import { useState } from 'react';

export const useModerators = () => {
  const { communityId } = useParams();
  const { user: currentUser } = useAuth();
  const parsedCommunityId = Number(communityId);

  const [page, setPage] = useState(1);


  const { data: moderatorsResponse, isLoading: isLoadingModeratorsMemberships } =
    useGetCommunityMembershipsQuery({
      communityId: parsedCommunityId,
      role: "moderator",
      page ,
      limit: 10,
    });

  const { data: currentUserMembershipsResponse, isLoading: isLoadingCurrentUserMemberships } =
    useGetCommunityMembershipsQuery({
      communityId: parsedCommunityId,
      userId: currentUser?.id,
      limit: 1,
    }, {
      skip: !currentUser,
    });

  const moderators =
    moderatorsResponse?.data

  const currentUserMembership = currentUserMembershipsResponse?.data[0];

  const totalPages=moderatorsResponse?.meta.totalPages ;

  const canRemoveModerator = (
    targetMod: CommunityMembership
  ): boolean => {
    if (!currentUser || !currentUserMembership) return false;

    const isSelf = currentUserMembership.userId === targetMod.userId;
    const hasLowerRank = currentUserMembership.rank < targetMod.rank;

    return isSelf || hasLowerRank;
  };

  const [updateRole, { isLoading: isUpdating }] =
    useUpdateMemberRoleMutation();

  const handleDemoteModerator = async (targetUserId: number) => {
    if (!communityId) return;
    try {
      await updateRole({
        communityId: parsedCommunityId,
        userId: targetUserId,
        role: 'member', // demote to 'member' — change value if your API expects something else
      }).unwrap();
    } catch (err) {
      console.error('Failed to update member role:', err);
    }
  };

  return {
    moderators,
    isLoading: isLoadingModeratorsMemberships || isLoadingCurrentUserMemberships,
    isUpdating,
    canRemoveModerator,
    handleDemoteModerator,
    page,
    setPage ,
    totalPages
  };
};
