import { useParams } from 'react-router-dom';
import { useGetCommunityMembershipsQuery } from '../services/communityMembershipsApi';
import { useState } from 'react';

export const useCommunityMemberships = () => {
  const { communityId } = useParams();
   const [page, setPage] = useState(1);
 const { data: response, isLoading } = useGetCommunityMembershipsQuery({
    communityId: Number(communityId),
    page
  });
  const totalPages=response?.meta.totalPages ;

  return {
    memberships: response?.data ?? [],
    isLoading,
    communityId,
     page,
    setPage ,
    totalPages
  };
};
