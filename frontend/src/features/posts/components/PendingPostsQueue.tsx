import { useParams } from "react-router-dom";
import { useGetPostsInfiniteQuery, useUpdatePostStatusMutation } from "../services/postsApi";
import { Button } from "../../../shared/components/ui/Button";
import { PostStatus } from "../types";

export const PendingPostsQueue = () => {
  const { communityId } = useParams();
  const { data, isLoading } = useGetPostsInfiniteQuery({
    communityId: +communityId,
    status: PostStatus.PENDING,
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
          <div key={post.id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900 text-lg">{post.title}</p>
              <p className="text-sm text-gray-700">{post.content}</p>
              <p className="text-xs text-gray-500 italic">
                Posted by User #{post.author.name} on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => approvePost(post.id)} className="bg-green-600 hover:bg-green-700">Approve</Button>
              <Button size="sm" variant="outline" onClick={() => rejectPost(post.id)} className="text-red-600 border-red-600 hover:bg-red-50">Reject</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
