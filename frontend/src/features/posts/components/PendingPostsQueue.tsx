import { useParams } from "react-router-dom";
import { useGetPostsInfiniteQuery, useUpdatePostStatusMutation } from "../services/postsApi";
import { Button } from "../../../shared/components/ui/Button";
import { PostStatus } from "../types";
import PendingPostCard from "./PendingPostCard";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";

export const PendingPostsQueue = () => {
  const { communityId } = useParams();
  const { data, isLoading,hasNextPage,fetchNextPage,isFetchingNextPage } = useGetPostsInfiniteQuery({
    communityId: +communityId,
    status: PostStatus.PENDING,
  });


    const { sentinelRef } = useInfiniteScroll({
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    });
    
  const [updatePostStatus] = useUpdatePostStatusMutation();

  const approvePost = (postId: number) => {
    updatePostStatus({ id: postId, status: PostStatus.APPROVED });
  };

  const rejectPost = (postId: number) => {
    updatePostStatus({ id: postId, status: PostStatus.REJECTED });
  };


  if (isLoading) return <div className="p-4">Loading pending posts...</div>;

  const posts = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="space-y-3">
      {posts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <p className="text-gray-500 italic">No pending posts to review.</p>
        </div>
      ) : (
        posts.map((post) => (
         <PendingPostCard post={post} approvePost={approvePost} rejectPost={rejectPost} />
        ))
      )}

         <div ref={sentinelRef} />
      {isFetchingNextPage && <div className="p-4 text-center">Loading more comments...</div>}
    </div>
  
  );
};
