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

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { data, error, isLoading } = useGetPostByIdQuery(postId);
  const { showToast } = useToastContext();

 
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

  console.log(post);
  
  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Main Content Area */}
      <div className="md:w-[70%]">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Post Metadata (Author, Community, Date) */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            {post.community && (
              <>
                <FaUsers className="mr-1" />
                <Link
                  to={`/communities/${post.community.id}`}
                  className="font-semibold hover:underline mr-2"
                >
                  c/{post.community.name}
                </Link>
                <span className="mx-1">•</span>
              </>
            )}
            <FaUser className="mr-1" />
            <span>Posted by u/{post.author.name}</span>
            <span className="mx-1">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Post Title */}
          <h1 className="text-3xl font-bold text-gray-800 leading-tight mb-4">
            {post.title}
          </h1>
          {/* Post Content */}
          <p className="text-gray-700 text-base mb-6">{post.content}</p>

          {/* Action Buttons and Votes */}
          <div className="flex items-center justify-between mt-4 text-gray-500 text-sm  pt-3">
            <div className="flex items-center space-x-4">
              {/* Vote Buttons */}
              <PostReactionButtons post={post}/>
              {/* Other Action Buttons */}
              <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors">
                <FaCommentAlt /> <span>{post.commentsCount || 0} Comments</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors">
                <FaShareAlt /> <span>Share</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors">
                <FaBookmark /> <span>Save</span>
              </button>
            </div>
            <div className="flex items-center space-x-1">
              <FaEye /> <span>{post.views}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentList postId={postId} />
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
