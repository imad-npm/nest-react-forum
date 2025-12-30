import { useParams } from 'react-router-dom';
import {
  useGetCommunityRestrictionsQuery,
  useDeleteCommunityRestrictionMutation,
} from '../services/communityRestrictionsApi';
import { CommunityRestrictionType } from '../types';

export const useMutedUsers = () => {
  const { communityId } = useParams();
  const { data: restrictions, isLoading } = useGetCommunityRestrictionsQuery({
    communityId: +communityId,
    restrictionType: CommunityRestrictionType.MUTE,
    page: 1,
    limit: 10,
  });
  const [unmute] = useDeleteCommunityRestrictionMutation();

  return {
    mutedUsers: restrictions?.data ?? [],
    isLoading,
    unmuteUser: unmute,
  };
};
