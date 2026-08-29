import { useParams } from 'react-router-dom';
import {
  useGetCommunityRestrictionsInfiniteQuery,
  useDeleteCommunityRestrictionMutation,
} from '../services/communityRestrictionsApi';
import { CommunityRestrictionType } from '../types';

export const useBannedUsers = () => {
  const { communityId } = useParams();
 
  const { data: restrictions, isLoading } = useGetCommunityRestrictionsInfiniteQuery({
    communityId:Number(communityId),
    restrictionType: CommunityRestrictionType.BAN,
    page: 1,
    limit: 10,
  });
  const [unban] = useDeleteCommunityRestrictionMutation();
  
const bannedUsers = restrictions?.pages.flatMap((page) => page.data) ?? [];
  return {
    bannedUsers: bannedUsers,
    isLoading,
    unbanUser: unban,
  };
};
