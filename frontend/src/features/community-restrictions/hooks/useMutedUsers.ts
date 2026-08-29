import { useParams } from 'react-router-dom';
import {
  useGetCommunityRestrictionsInfiniteQuery,
  useDeleteCommunityRestrictionMutation,
} from '../services/communityRestrictionsApi';
import { CommunityRestrictionType } from '../types';

export const useMutedUsers = () => {
  const { communityId } = useParams();
  const { data: restrictions, isLoading } = useGetCommunityRestrictionsInfiniteQuery({
    communityId: +communityId,
    restrictionType: CommunityRestrictionType.MUTE,
    page: 1,
    limit: 10,
  });
  const [unmute] = useDeleteCommunityRestrictionMutation();
const mutedUsers = restrictions?.pages.flatMap((page) => page.data) ?? [];

  return {
    mutedUsers: mutedUsers,
    isLoading,
    unmuteUser: unmute,
  };
};
