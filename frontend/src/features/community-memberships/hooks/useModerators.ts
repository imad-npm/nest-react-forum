import { useParams } from 'react-router-dom';
import {
  useGetCommunityMembershipsQuery,
  useRemoveCommunityMemberMutation,
} from '../services/communityMembershipsApi';
import { useAuth } from '../../auth/hooks/useAuth';
import type { User, CommunityMembership } from '../types';

export const useModerators = () => {
  const { communityId } = useParams();
  const { user: currentUser } = useAuth();
  const parsedCommunityId = Number(communityId);

  const { data: allMembershipsResponse, isLoading: isLoadingMemberships } =
    useGetCommunityMembershipsQuery({
      communityId: parsedCommunityId,
      limit: 100,
    });

  const moderators =
    allMembershipsResponse?.data.filter((m) => m.role === 'moderator') ?? [];

  const currentUserMembership = allMembershipsResponse?.data.find(
    (member) => member.userId === currentUser?.id
  );

  const canRemoveModerator = (
    targetMod: CommunityMembership
  ): boolean => {
    if (!currentUser || !currentUserMembership) return false;

    const isSelf = currentUserMembership.userId === targetMod.userId;
    const hasLowerRank = currentUserMembership.rank < targetMod.rank;

    return isSelf || hasLowerRank;
  };

  const [removeCommunityMember, { isLoading: isRemovingMember }] =
    useRemoveCommunityMemberMutation();

  const handleRemoveModerator = async (targetUserId: number) => {
    if (!communityId) return;
    try {
      await removeCommunityMember({
        communityId: parsedCommunityId,
        targetUserId,
      }).unwrap();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  return {
    moderators,
    isLoading: isLoadingMemberships,
    isRemovingMember,
    canRemoveModerator,
    handleRemoveModerator,
  };
};
