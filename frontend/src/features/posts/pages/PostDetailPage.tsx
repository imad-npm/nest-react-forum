import { useParams, Link } from 'react-router-dom';
import { useGetPostByIdQuery } from '../services/postsApi';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import {
  FaArrowUp,
  FaArrowDown,
  FaCommentAlt,
  FaShareAlt,
  FaBookmark,
  FaUser,
  FaUsers,
  FaEye,
} from 'react-icons/fa';
import CommentList from '../../comments/components/CommentList'; // Import CommentList
import { AboutCommunity } from '../../communities/components/AboutCommunity';
import { PostReactionButtons } from '../../reactions/components/PostReactionButtons';
import { PostSuggestionsList } from '../components/PostSuggestionsList';
import PostDetailCard from '../components/PostDetailCard'; // Import PostDetailCard
import { useGetCommentsInfiniteQuery } from '../../comments/services/commentsApi'; // NEW IMPORT

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { data, error, isLoading } = useGetPostByIdQuery(postId);
  const { showToast } = useToastContext();

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingComments,
  } = 
  useGetCommentsInfiniteQuery(        { postId, limit: 10 }, // Pass postId and queryArg with limit
); // Use the hook to fetch comments

  const comments = commentsData?.pages?.flatMap((page) => page.data) || [];
 
  if (isLoading) {
    return <div className="text-center mt-8">Loading post...</div>;
  }

  if (error) {
    const errorMessage =
      (error as any).data?.message || (error as any).message || 'Failed to load post';
    showToast(errorMessage, 'error');
    return <div className="text-center mt-8 text-red-500">{errorMessage}</div>;
  }

  if (!data?.data) {
    return <div className="text-center mt-8">Post not found.</div>;
  }

  const post = data.data;

  console.log(comments);
  
  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
            {/* Main Content Area */}
            <div className="md:w-[70%]">
              <PostDetailCard post={post} />
              {/* Comments Section */}
              <CommentList
                comments={comments}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoadingComments}
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
