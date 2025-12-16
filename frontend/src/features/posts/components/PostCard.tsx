import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import {
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
  FaUser,
  FaUsers,
  FaArrowUp, // Upvote icon
  FaArrowDown, // Downvote icon
  FaCommentAlt, // Comment icon
  FaShareAlt, // Share icon
  FaBookmark, // Save icon
} from 'react-icons/fa';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Placeholder for vote logic
  const handleVote = (direction: 'up' | 'down') => {
    console.log(`Voted ${direction} on post ${post.id}`);
    // Implement actual API call for voting here
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mb-6 p-5"> {/* Increased mb and p */}
      {/* Post Metadata (Author, Community, Date) */}
      <div className="flex items-center text-sm text-gray-500 mb-3"> {/* Increased mb */}
        {post.community && (
          <>
            <FaUsers className="mr-1" />
            <Link
              to={`/communities/${post.community.id}`}
              className="font-semibold hover:underline mr-2"
            >
              c/{post.community.name}
            </Link>
            <span className="mx-1">•</span>
          </>
        )}
        <FaUser className="mr-1" />
        <span>Posted by u/{post.author.name}</span>
        <span className="mx-1">•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Post Title */}
      <Link to={`/posts/${post.id}`}>
        <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 leading-tight mb-3"> {/* Increased mb */}
          {post.title}
        </h2>
      </Link>
      {/* Post Content */}
      <p className="text-gray-700 text-sm line-clamp-3 mb-4">{post.content}</p> {/* Increased mb */}

      {/* Action Buttons and Votes */}
      <div className="flex items-center justify-between mt-3 text-gray-500 text-sm  "> {/* Increased mt, added border-t and pt */}
        <div className="flex items-center space-x-4">
          {/* Vote Buttons */}
          <div className="flex items-center space-x-2"> {/* Increased space-x */}
            <button
              onClick={() => handleVote('up')}
              className="text-gray-400 hover:text-blue-500 transition-colors p-1"
              aria-label="Upvote"
            >
              <FaArrowUp size={18} /> {/* Increased icon size slightly */}
            </button>
            <span className="font-bold text-gray-700">
              {post.likesCount - post.dislikesCount}
            </span>
            <button
              onClick={() => handleVote('down')}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Downvote"
            >
              <FaArrowDown size={18} /> {/* Increased icon size slightly */}
            </button>
          </div>

          {/* Other Action Buttons */}
          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
            <FaCommentAlt /> <span>{post.comments?.length || 0} Comments</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
            <FaShareAlt /> <span>Share</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
            <FaBookmark /> <span>Save</span>
          </button>
        </div>
        <div className="flex items-center space-x-1">
            <FaEye /> <span>{post.views}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
