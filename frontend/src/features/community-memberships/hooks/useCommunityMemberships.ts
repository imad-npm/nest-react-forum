import { useParams } from 'react-router-dom';
import { useGetCommunityMembershipsQuery } from '../services/communityMembershipsApi';

export const useCommunityMemberships = () => {
  const { communityId } = useParams();
  const { data: response, isLoading } = useGetCommunityMembershipsQuery({
    communityId: Number(communityId),
  });

  return {
    memberships: response?.data ?? [],
    isLoading,
    communityId,
  };
};
