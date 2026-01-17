import { useParams } from 'react-router-dom';
import { useGetCommunityMembershipsQuery } from '../services/communityMembershipsApi';
import { useState } from 'react';

export const useMembers = () => {
  const { communityId } = useParams();
   const [page, setPage] = useState(1);
 const { data: response, isLoading } = useGetCommunityMembershipsQuery({
    communityId: Number(communityId),
    role : "member" ,
    page
  });
  const totalPages=response?.meta.totalPages ;
  const total = response?.meta.totalItems

  return {
    memberships: response?.data ?? [],
    isLoading,
    communityId,
     page,
    setPage ,
    totalPages,
    total
  };
};
