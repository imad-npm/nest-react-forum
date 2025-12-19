import React from 'react';
import type { Comment } from '../types';
import { Link } from 'react-router-dom';
import { FaUser, FaReply } from 'react-icons/fa'; // Removed unused FaArrowUp, FaArrowDown
import { CommentReactionButtons } from '../../reactions/components/CommentReactionButtons';

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: number, authorName: string) => void;
  level: number; // Added level prop for indentation
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onReply, level }) => {
  const paddingLeft = level * 20; // Adjust indentation as needed (e.g., 20px per level)

  return (
    <div style={{ paddingLeft: `${paddingLeft}px` }} className="mb-3"> {/* Added paddingLeft */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <FaUser className="mr-1" />
          <span>u/{comment.author.name}</span>
          <span className="mx-1">•</span>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-800 text-sm mb-3">{comment.content}</p>

        <div className="flex items-center space-x-4 text-gray-500 text-xs">
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

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3"> {/* Added margin-top for spacing replies */}
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              level={level + 1} // Increment level for replies
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
