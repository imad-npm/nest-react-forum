import { useState, useMemo } from 'react';
import type { Comment } from '../types';
import { FaUser, FaReply } from 'react-icons/fa';
import { CommentReactionButtons } from '../../reactions/components/CommentReactionButtons';
import { useGetCommentsByPostIdInfiniteQuery } from '../services/commentsApi';
import { Button } from '../../../shared/components/ui/Button';

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: number, authorName: string) => void;
  postId: number;
}

const REPLIES_LIMIT = 2;

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onReply,
  postId,
}) => {
  /* ------------------------------
   * Initial (preloaded) replies
   * ------------------------------ */
  const initialReplies = comment.replies ?? [];
  const initialRepliesCount = initialReplies.length;

  const hasMoreRepliesThanInitial =
    comment.repliesCount > initialRepliesCount;

  const [showReplies, setShowReplies] = useState(
    initialRepliesCount > 0
  );

  /* ------------------------------
   * Infinite query (ALWAYS page 1)
   * ------------------------------ */
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
      initialPageParam: 1,
    }
  );

  /* ------------------------------
   * Merge + dedupe + enforce limit
   * ------------------------------ */
  const allReplies = useMemo(() => {
    const fetchedReplies =
      data?.pages.flatMap(page => page.data) ?? [];

    const merged = [...initialReplies, ...fetchedReplies];

    // Deduplicate by id
    const unique = new Map<number, Comment>();
    merged.forEach(reply => unique.set(reply.id, reply));

    const sorted = Array.from(unique.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );

    // Enforce max replies based on loaded pages
    const loadedPages = data?.pages.length ?? 1;
    const maxAllowed = REPLIES_LIMIT * loadedPages;

    return sorted.slice(0, maxAllowed);
  }, [initialReplies, data]);

  /* ------------------------------
   * Render
   * ------------------------------ */
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
        </div>

        <p className="mb-3 text-sm text-gray-800">
          {comment.content}
        </p>

        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <CommentReactionButtons comment={comment} />

          {onReply && (
            <button
              onClick={() =>
                onReply(comment.id, comment.author.name)
              }
              className="flex items-center space-x-1 hover:text-blue-600"
            >
              <FaReply />
              <span>Reply</span>
            </button>
          )}

          {comment.repliesCount > 0 && (
            <Button
              onClick={() => setShowReplies(v => !v)}
             variant="link"
            >
              {showReplies
                ? `Hide replies (${comment.repliesCount})`
                : hasMoreRepliesThanInitial
                ? `+ Load replies (${comment.repliesCount - allReplies.length} remaining)`
                : `View replies (${comment.repliesCount})`}
            </Button>
          )}
        </div>
      </div>

      {/* REPLIES */}
      {showReplies && allReplies.length > 0 && (
        <div className="mt-3 ml-6 border-l border-gray-200 pl-4">
          {allReplies.map(reply => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              postId={postId}
            />
          ))}
        </div>
      )}

      {showReplies && hasNextPage && (
        <div className="mt-2 ml-6 flex justify-center">
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
