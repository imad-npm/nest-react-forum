import { FaUser, FaReply } from 'react-icons/fa';
import type { Comment } from '../types';
import { CommentReactionButtons } from '../../reactions/components/CommentReactionButtons';
import { Button } from '../../../shared/components/ui/Button';
import { CommentInput } from './CommentInput';
import { timeAgo } from '../../../shared/utils/date';
import { useCommentCard } from '../hooks/useCommentCard';

interface CommentCardProps {
  comment: Comment;
  postId: number;
  level: number;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  postId,
  level,
}) => {
  const {
    showReplies,
    setShowReplies,
    showReplyInput,
    setShowReplyInput,
    allReplies,
    remainingReplies,
    handleReplyPosted,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    shouldRender,
  } = useCommentCard({ comment, postId, level });

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="mb-3">
      {/* COMMENT CARD */}
      <div className="rounded-lg border border-gray-300 bg-white p-4 ">
        <div className="mb-2 flex items-center text-sm text-gray-500">
          <FaUser className="mr-1" />
          <span>u/{comment.author.username}</span>
          <span className="mx-1">•</span>
          <span className="text-xs">{timeAgo(comment.createdAt)}</span>
        </div>

        {/* DEBUG */}
        <div className="mb-1 text-xs text-gray-400">
          id: {comment.id}, parentId: {comment.parentId ?? 'null'}
          {showReplies ? ' 1' : ' 0'}
        </div>

        <p className="mb-3 text-sm text-gray-800">{comment.content}</p>

        <div className="flex items-center space-x-4 text-xs ">
          <CommentReactionButtons comment={comment} />

          <Button variant='ghost' size='sm'
            onClick={() => setShowReplyInput((v) => !v)}
          >
            <FaReply />
            <span className='mx-2'>Reply</span>
          </Button>

          {comment.repliesCount > 0 && (
            <Button onClick={() => setShowReplies((v) => !v)} variant="link">
              {showReplies
                ? `Hide replies (${comment.repliesCount})`
                : remainingReplies > 0
                ? `+ Load replies (${remainingReplies} remaining)`
                : `View replies (${comment.repliesCount})`}
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
          {allReplies.map((reply) => (
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
          <Button variant="link" onClick={fetchNextPage} disabled={isFetchingNextPage}>
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
