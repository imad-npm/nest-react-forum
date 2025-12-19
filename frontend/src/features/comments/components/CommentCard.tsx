import React, { useState, useEffect, useMemo } from 'react';
import type { Comment } from '../types';
import { Link } from 'react-router-dom';
import { FaUser, FaReply } from 'react-icons/fa';
import { CommentReactionButtons } from '../../reactions/components/CommentReactionButtons';
import { useGetCommentsByPostIdInfiniteQuery } from '../services/commentsApi';
import { Button } from '../../../shared/components/ui/Button';

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: number, authorName: string) => void;
  level: number;
  postId: number;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onReply, level, postId }) => {
  const [showReplies, setShowReplies] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCommentsByPostIdInfiniteQuery(
    { postId, parentId: comment.id, limit: 2 },
    { skip: !showReplies || !comment.repliesCount }
  );
  const allReplies = data?.pages?.flatMap(p => p.data) || [];

  /*
    const allReplies = useMemo(() => {
      const initialReplies = comment.replies || [];
      const fetchedReplies = data?.pages?.flatMap(p => p.data) || [];
  
      const map = new Map<number, Comment>();
      [...initialReplies, ...fetchedReplies].forEach(r => map.set(r.id, r));
  
      return [...map.values()].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }, [comment.replies, data]);
  */
  return (
    <div className="mb-3">
      {/* COMMENT CARD (never indented) */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <FaUser className="mr-1" />
          <span>u/{comment.author.name}</span>
          <span className="mx-1">•</span>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        {/* DEBUG INFO */}
        <div className="text-xs text-gray-400 mb-1">
          id: {comment.id}, parentId: {comment.parentId ?? 'null'}
        </div>
        <p className="text-gray-800 text-sm mb-3">{comment.content}</p>

        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <CommentReactionButtons comment={comment} />

          {onReply && (
            <button
              onClick={() => onReply(comment.id, comment.author.name)}
              className="flex items-center space-x-1 hover:text-blue-600"
            >
              <FaReply />
              <span>Reply</span>
            </button>
          )}

          {comment.repliesCount > 0 && (
            <button
              onClick={() => setShowReplies(v => !v)}
              className="text-blue-600 hover:underline"
            >
              {showReplies
                ? `Hide replies (${comment.repliesCount})`
                : `View replies (${comment.repliesCount})`}
            </button>
          )}
        </div>
      </div>

      {/* REPLIES (only this is indented) */}
      {showReplies && allReplies.length > 0 && (
        <div className="mt-3 ml-6 border-l border-gray-200 pl-4">
          {allReplies.map(reply => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              level={level + 1}
              postId={postId}
            />
          ))}
        </div>
      )}

      {showReplies && comment.repliesCount > allReplies.length && hasNextPage && (
        <div className="flex justify-center mt-2 ml-6">
          <Button onClick={fetchNextPage} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more replies…' : 'Load more replies'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
