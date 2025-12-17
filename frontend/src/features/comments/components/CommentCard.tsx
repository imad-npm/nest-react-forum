import React from 'react';
import type { Comment } from '../types';
import { Link } from 'react-router-dom';
import { FaUser, FaArrowUp, FaArrowDown, FaReply } from 'react-icons/fa';
import { CommentReactionButtons } from '../../reactions/components/CommentReactionButtons';

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: number, authorName: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onReply }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-200">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <FaUser className="mr-1" />
        <span>u/{comment.author.name}</span>
        <span className="mx-1">•</span>
        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-800 text-sm mb-3">{comment.content}</p>

      <div className="flex items-center space-x-4 text-gray-500 text-xs">
        {/* Replace placeholder vote buttons with CommentReactionButtons */}
        <CommentReactionButtons comment={comment} />

        {onReply && (
          <button
            onClick={() => onReply(comment.id, comment.author.name)}
            className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
          >
            <FaReply /> <span>Reply</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
