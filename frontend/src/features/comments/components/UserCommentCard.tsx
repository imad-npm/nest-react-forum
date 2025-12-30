import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Comment } from '../types';
import { FaUser, FaQuoteLeft } from 'react-icons/fa';
import { timeAgo } from '../../../shared/utils/date';

interface UserCommentCardProps {
  comment: Comment;
}

const UserCommentCard: React.FC<UserCommentCardProps> = ({ comment }) => {
  const navigate = useNavigate();
  console.log(comment.post);
  
  const handleCardClick = () => {
    if (comment.post?.id) {
      navigate(`/posts/${comment.post.id}`);
    }
  };

  return (
    <div
      className="mb-3 cursor-pointer rounded-lg border border-gray-300 bg-white p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
      onClick={handleCardClick}
    >
      <div className="mb-2 flex items-center text-sm text-gray-500">
        <FaUser className="mr-1" />
        <span>u/{comment.author.username}</span>
        <span className="mx-1">•</span>
        <span className="text-xs">
          {timeAgo(comment.createdAt)}
        </span>
        {comment.post && (
          <>
            <span className="mx-1">•</span>
            <FaQuoteLeft className="mr-1 text-xs" />
            <span className="text-xs font-semibold">
              on "{comment.post.title}"
              {comment.post.community && ` in c/${comment.post.community.name}`}
            </span>
          </>
        )}
      </div>

      <p className="mb-3 text-sm text-gray-800 line-clamp-2">
        {comment.content}
      </p>

      {/* No reply buttons or reaction buttons here, just a simple display */}
    </div>
  );
};

export default UserCommentCard;
