import { useParams } from "react-router-dom";
import { useGetPostsInfiniteQuery } from "../services/postsApi";
import { PostStatus } from "../types";

export const RejectedPostsQueue = () => {
  const { communityId } = useParams();
  const { data, isLoading } = useGetPostsInfiniteQuery({
    communityId: +communityId,
    status: PostStatus.REJECTED,
  });

  if (isLoading) return <div className="p-4">Loading rejected posts...</div>;

  const posts = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="space-y-3">
      {posts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <p className="text-gray-500 italic">No rejected posts to review.</p>
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
          </div>
        ))
      )}
    </div>
  );
};
