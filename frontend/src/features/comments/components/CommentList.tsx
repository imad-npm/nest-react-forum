import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGetCommentsByPostIdQuery } from '../services/commentsApi';
import CommentCard from './CommentCard';
import type { Comment } from '../types';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import CommentInput from './CommentInput'; // Corrected import
import { useAppSelector } from '../../../shared/stores/hooks';

interface CommentListProps {
  postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allComments, setAllComments] = useState<Comment[]>([]); // Local state to accumulate comments
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | undefined>(undefined);
  const [replyingToAuthor, setReplyingToAuthor] = useState<string | undefined>(undefined);

  const { data, error, isLoading, isFetching } = useGetCommentsByPostIdQuery({ postId, page, limit: 10 });
  const { showToast } = useToastContext();
  const observer = useRef<IntersectionObserver>();

  // Reset page and comments when postId changes
  useEffect(() => {
    setPage(1);
    setAllComments([]);
    setHasMore(true);
  }, [postId]);

  // Update allComments and hasMore based on response
  useEffect(() => {
    if (data?.data && !isFetching) {
      setAllComments((prevComments) => {
        const newComments = data.data.filter(
          (newComment) => !prevComments.some((prevComment) => prevComment.id === newComment.id),
        );
        return [...prevComments, ...newComments];
      });
      setHasMore(data.meta.page < data.meta.totalPages);
    }
  }, [data, isFetching]);

  // Infinite scroll observer
  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore],
  );

  // Show error toast
  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as any).data?.message || (error as any).message || 'Failed to load comments';
      showToast(errorMessage, 'error');
    }
  }, [error, showToast]);

  const handleCommentPosted = () => {
    // This will refetch the first page, and due to the merge strategy, will update the list
    setPage(1);
    setAllComments([]); // Clear existing comments to ensure fresh data and re-merge
    setReplyingToCommentId(undefined); // Clear reply state
    setReplyingToAuthor(undefined);
  };

  const handleReplyClick = (commentId: number, authorName: string) => {
    setReplyingToCommentId(commentId);
    setReplyingToAuthor(authorName);
  };

  const handleCancelReply = () => {
    setReplyingToCommentId(undefined);
    setReplyingToAuthor(undefined);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      <CommentInput
        postId={postId}
        onCommentPosted={handleCommentPosted}
      />

      {allComments.length === 0 && !isLoading && !isFetching ? (
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {allComments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <CommentCard
                comment={comment}
                onReply={handleReplyClick}
              />
              {replyingToCommentId === comment.id && (
                <div className="ml-8 mt-2"> {/* Indent reply input */}
                  <CommentInput
                    postId={postId}
                    parentId={comment.id}
                    onCommentPosted={handleCommentPosted}
                    onCancelReply={handleCancelReply}
                    replyingTo={replyingToAuthor}
                  />
                </div>
              )}
              {/* If it's the last comment and there's more to load, attach ref */}
              {index === allComments.length - 1 && hasMore && (
                <div ref={lastCommentElementRef} className="h-1 bg-transparent" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {(isLoading || isFetching) && page > 1 && (
        <div className="text-center mt-4">Loading more comments...</div>
      )}

      {!hasMore && !isLoading && allComments.length > 0 && (
        <p className="text-center text-gray-600 mt-4">You have reached the end of the comments.</p>
      )}
    </div>
  );
};

export default CommentList;
