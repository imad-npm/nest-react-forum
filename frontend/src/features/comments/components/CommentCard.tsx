import React from 'react';
import type { Comment } from '../types';
import { Link } from 'react-router-dom';
import { FaUser, FaArrowUp, FaArrowDown, FaReply } from 'react-icons/fa';

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: number, authorName: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onReply }) => {
  // Placeholder for vote logic
  const handleVote = (direction: 'up' | 'down') => {
    console.log(`Voted ${direction} on comment ${comment.id}`);
    // Implement actual API call for voting here
  };

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
        {/* Vote Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleVote('up')}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Upvote Comment"
          >
            <FaArrowUp size={14} />
          </button>
          <span className="font-bold text-gray-700">
            {comment.likesCount - comment.dislikesCount}
          </span>
          <button
            onClick={() => handleVote('down')}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Downvote Comment"
          >
            <FaArrowDown size={14} />
          </button>
        </div>

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
