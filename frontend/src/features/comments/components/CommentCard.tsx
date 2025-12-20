import { useState, useMemo, useEffect } from 'react';
import type { Comment } from '../types';
import { FaUser, FaReply } from 'react-icons/fa';
import { CommentReactionButtons } from '../../reactions/components/CommentReactionButtons';
import { useGetCommentsByPostIdInfiniteQuery } from '../services/commentsApi';
import { Button } from '../../../shared/components/ui/Button';
import { CommentInput } from './CommentInput'; // Import CommentInput

interface CommentCardProps {
  comment: Comment;
  postId: number;
  level: number; // Ensure level is passed
}

const REPLIES_LIMIT = 2;

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  postId,
  level,
}) => {
const [showReplies, setShowReplies] = useState(false);

useEffect(() => {
  if (comment.repliesCount > 0) {
    setShowReplies(true);
  }
}, [comment.repliesCount]);
  const [showReplyInput, setShowReplyInput] = useState(false); // State for reply input visibility

  const initialReplies = comment.replies ?? [];
  const initialRepliesCount = initialReplies.length;

  const hasMoreRepliesThanInitial = comment.repliesCount > initialRepliesCount;

  // Calculate the initial page parameter for the infinite query
  // If we already have initial replies, start fetching from the next page
  const initialQueryPageParam = 1

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCommentsByPostIdInfiniteQuery(
    {
      postId,
      parentId: comment.id,
      limit: REPLIES_LIMIT,
    },
    {
      skip: !showReplies || !hasMoreRepliesThanInitial,
      initialPageParam: initialQueryPageParam, // Set the initial page to start fetching from
    }
  );

  const allReplies = useMemo(() => {
    const fetchedReplies = data?.pages.flatMap(page => page.data) || [];
    const combinedReplies = [...initialReplies, ...fetchedReplies];

    const map = new Map<number, Comment>();
    combinedReplies.forEach(reply => map.set(reply.id, reply));

    return [...map.values()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [initialReplies, data]);
  const remainingReplies = Math.max(0, comment.repliesCount - allReplies.length);
  const handleReplyPosted = () => {
    setShowReplyInput(false);
    // Rely on RTK Query cache invalidation for UI update
  };

  return (
    <div className="mb-3">
      {/* COMMENT CARD */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center text-sm text-gray-500">
          <FaUser className="mr-1" />
          <span>u/{comment.author.name}</span>
          <span className="mx-1">•</span>
          <span>
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* DEBUG */}
        <div className="mb-1 text-xs text-gray-400">
          id: {comment.id}, parentId:{' '}
          {comment.parentId ?? 'null'}
          { showReplies? " 1" : " 0"}
        </div>

        <p className="mb-3 text-sm text-gray-800">
          {comment.content}
        </p>

        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <CommentReactionButtons comment={comment} />

          <button
            onClick={() => setShowReplyInput(v => !v)} // Toggle reply input
            className="flex items-center space-x-1 hover:text-primary-600"
          >
            <FaReply />
            <span>Reply</span>
          </button>

            {comment.repliesCount > 0 && (
            <Button onClick={() => setShowReplies(v => !v)} variant="link">
              {showReplies ? (
                `Hide replies (${comment.repliesCount})`
              ) : remainingReplies > 0 ? (
                `+ Load replies (${remainingReplies} remaining)`
              ) : (
                `View replies (${comment.repliesCount})`
              )}
            </Button>
          )}
        </div>
      </div>

      {showReplyInput && (
        <div className="mt-3 ml-6 border-l border-gray-200 pl-4">
          <CommentInput
            postId={postId}
            parentId={comment.id}
            onCommentPosted={handleReplyPosted}
            onCancel={() => setShowReplyInput(false)}
            autoFocus
          />
        </div>
      )}

      {/* REPLIES */}
      {showReplies && allReplies.length > 0 && (
        <div className="mt-3 ml-6 border-l border-gray-200 pl-4">
          {allReplies.map(reply => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={postId}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {showReplies && hasNextPage && (
        <div className="flex justify-center mt-2 ml-6">
          <Button
            variant='link'
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage
              ? 'Loading more replies…'
              : '+ Load more replies'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
