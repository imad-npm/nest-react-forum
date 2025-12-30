import { useParams } from 'react-router-dom';
import {
  useGetCommunityRestrictionsQuery,
  useDeleteCommunityRestrictionMutation,
} from '../services/communityRestrictionsApi';
import { CommunityRestrictionType } from '../types';

export const useBannedUsers = () => {
  const { communityId } = useParams();
  const { data: restrictions, isLoading } = useGetCommunityRestrictionsQuery({
    communityId: +communityId,
    restrictionType: CommunityRestrictionType.BAN,
    page: 1,
    limit: 10,
  });
  const [unban] = useDeleteCommunityRestrictionMutation();

  return {
    bannedUsers: restrictions?.data ?? [],
    isLoading,
    unbanUser: unban,
  };
};
