import { useState, useMemo, useEffect } from 'react';
import type { Comment } from '../types';
import { useGetCommentsInfiniteQuery } from '../services/commentsApi';

const REPLIES_LIMIT = 2;
const MAX_DEPTH = 5;

interface UseCommentCardProps {
  comment: Comment;
  postId: number;
  level: number;
}

export const useCommentCard = ({
  comment,
  postId,
  level,
}: UseCommentCardProps) => {
  const [showReplies, setShowReplies] = useState(false);
  useEffect(() => {
    if (comment.repliesCount > 0) {
      setShowReplies(true);
    }
  }, [comment.repliesCount]);

  const [showReplyInput, setShowReplyInput] = useState(false);

  const initialReplies = comment.replies ?? [];
  const initialRepliesCount = initialReplies.length;
  const hasMoreRepliesThanInitial = comment.repliesCount > initialRepliesCount;

  const initialQueryPageParam = 1;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetCommentsInfiniteQuery(
      { postId, parentId: comment.id, limit: REPLIES_LIMIT },
      {
        initialPageParam: initialQueryPageParam,
        skip: !showReplies || !hasMoreRepliesThanInitial,
      }
    );

  const allReplies = useMemo(() => {
    const fetchedReplies = data?.pages.flatMap((page) => page.data) || [];
    const combinedReplies = [...initialReplies, ...fetchedReplies];

    const map = new Map<number, Comment>();
    combinedReplies.forEach((reply) => map.set(reply.id, reply));

    return [...map.values()].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [initialReplies, data]);

  const remainingReplies = Math.max(0, comment.repliesCount - allReplies.length);

  const handleReplyPosted = () => {
    setShowReplyInput(false);
    // Rely on RTK Query cache invalidation for UI update
  };

  const shouldRender = level <= MAX_DEPTH;

  return {
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
  };
};
