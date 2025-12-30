import { useParams, Link } from 'react-router-dom';
import { useGetPostByIdQuery } from '../services/postsApi';
import { useToastContext } from '../../../shared/providers/ToastProvider';

import CommentList from '../../comments/components/CommentList'; // Import CommentList
import { CommentInput } from '../../comments/components/CommentInput'; // Import CommentInput
import { AboutCommunity } from '../../communities/components/AboutCommunity';
import { PostReactionButtons } from '../../reactions/components/PostReactionButtons';
import { PostSuggestionsList } from '../components/PostSuggestionsList';
import PostDetailCard from '../components/PostDetailCard'; // Import PostDetailCard
import { useGetCommentsInfiniteQuery } from '../../comments/services/commentsApi'; // NEW IMPORT
import { useEffect } from 'react';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { data, error, isLoading } = useGetPostByIdQuery(postId);
  const { showToast } = useToastContext();

   // ✅ HOOK ALWAYS RUNS
  useEffect(() => {
    if (!error) return;

    const errorMessage =
      (error as any).data?.message ||
      (error as any).message ||
      'Failed to load post';

    showToast(errorMessage, 'error');
  }, [error]);

  if (isLoading) {
    return <div className="text-center mt-8">Loading post...</div>;
  }

  if (!data?.data) {
    return <div className="text-center mt-8">Post not found.</div>;
  }

  const post = data.data;


  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Main Content Area */}
      <div className="md:w-[70%]">
        <PostDetailCard post={post} />
        <div className="mb-6">
                <CommentInput postId={post.id} />
  
        </div>
        {/* Comments Section */}
        <CommentList
          postId={post.id}
        />
      </div>

      {/* Sidebar Area (Right) */}
      <div className="md:w-[30%]">
        <PostSuggestionsList currentPostId={postId} communityId={post.community?.id} />
        {post.community && (
          <div className="mt-4">
            <AboutCommunity communityId={post.community.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
