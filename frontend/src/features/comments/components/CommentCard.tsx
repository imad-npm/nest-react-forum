import { FaUser, FaReply, FaComment } from 'react-icons/fa';
import type { Comment } from '../types';
import { ReactionButtons } from '../../reactions/components/ReactionButtons';
import { Button } from '../../../shared/components/ui/Button';
import { CommentInput } from './CommentInput';
import { timeAgo } from '../../../shared/utils/date';
import { useCommentCard } from '../hooks/useCommentCard';
import type { Post } from '../../posts/types';

interface CommentCardProps {
  comment: Comment;
  post: Post;
  level: number;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  post,
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
  } = useCommentCard({ comment,postId: post.id, level });

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
          <ReactionButtons target={comment} />

          {
            ! post.commentsLocked && (
                 <Button variant='ghost' size='sm'
            onClick={() => setShowReplyInput((v) => !v)}
          >
            <FaComment />
            <span className='mx-1.5'>Reply</span>
          </Button>
            )
          }

       

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
            postId={post.id}
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
              post={post}
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
