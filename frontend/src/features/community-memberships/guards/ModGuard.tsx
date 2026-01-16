import type { JSX } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useGetCommunityMembershipsQuery } from "../services/communityMembershipsApi";

function ModGuard({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const { communityId } = useParams();

  if (!user) return <Navigate to="/login" replace />;

  const {data ,isLoading} =useGetCommunityMembershipsQuery({
    userId :user.id,
    communityId:Number(communityId)
  })

  const isMod = data?.data[0].role=='moderator';

  if (!isMod) {
    return <Navigate to="/403" replace />;
  }

  return children;
}


export default ModGuard