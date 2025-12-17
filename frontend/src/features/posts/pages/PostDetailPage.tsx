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
import { Button } from '../../../shared/components/ui/Button';
import CommentList from '../../comments/components/CommentList'; // Import CommentList

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { data, error, isLoading } = useGetPostByIdQuery(postId);
  const { showToast } = useToastContext();

  // Placeholder for vote logic
  const handleVote = (direction: 'up' | 'down') => {
    console.log(`Voted ${direction} on post ${postId}`);
    // Implement actual API call for voting here
  };

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

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Main Content Area */}
      <div className="md:w-3/4">
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVote('up')}
                  className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                  aria-label="Upvote"
                >
                  <FaArrowUp size={18} />
                </button>
                <span className="font-bold text-gray-700">
                  {post.likesCount - post.dislikesCount}
                </span>
                <button
                  onClick={() => handleVote('down')}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Downvote"
                >
                  <FaArrowDown size={18} />
                </button>
              </div>

              {/* Other Action Buttons */}
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                <FaCommentAlt /> <span>{post.commentsCount || 0} Comments</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                <FaShareAlt /> <span>Share</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
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
      <div className="md:w-1/4">
        <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
          <h2 className="text-xl font-bold mb-4">About Community</h2>
          {post.community ? (
            <>
              <p className="text-gray-700 text-sm mb-2">
                This post belongs to the <span className="font-semibold">{post.community.name}</span> community.
              </p>
              <p className="text-gray-700 text-sm">
                Here you can find discussions about {post.community.name}.
              </p>
              <Button variant="default" className="w-full mt-4">
                Join Community
              </Button>
            </>
          ) : (
            <p className="text-gray-700 text-sm">
              This post does not belong to any specific community.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
