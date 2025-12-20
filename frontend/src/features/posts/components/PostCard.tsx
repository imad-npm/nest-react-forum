import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import {
  FaEye,
  FaRegEye,
  FaUser,
  FaUsers,
  FaRegCommentAlt,
  FaCommentAlt,
  FaRegBookmark,
  FaBookmark,
} from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { PostReactionButtons } from '../../reactions/components/PostReactionButtons';
import PostActionButtons from './PostActionButtons'; // Import the new component
import { timeAgo } from '../../../shared/utils/date'; // Import timeAgo from shared utils

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg s border border-gray-300 hover:shadow-lg transition-shadow duration-200 mb-6 p-5">
      {/* Post Metadata */}
      <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 space-x-1">
        {post.community && (
          <>
            <FaUsers className="mr-1" />
            <Link
              to={`/communities/${post.community.id}`}
              className="font-semibold hover:underline mr-1"
            >
              c/{post.community.name}
            </Link>
            <span className="mx-1">•</span>
          </>
        )}
        <FaUser className="mr-1" />
        <span>u/{post.author.name}</span>
        <span className="mx-1">•</span>
        <span className='text-xs'>{timeAgo(post.createdAt)}</span>
      </div>

      {/* Post Title */}
      <Link to={`/posts/${post.id}`}>
        <h2 className="text-lg  font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 leading-tight mb-2 line-clamp-2">
          {post.title}
        </h2>
      </Link>

      {/* Post Content */}
      <p className="text-gray-700 dark:text-gray-300 text-sm  line-clamp-3 mb-4">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3  dark:text-gray-400 text-sm md:text-base">
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Vote Buttons */}
          <PostReactionButtons post={post} />
          {/* Comment, Share, Save Buttons */}
          <PostActionButtons post={post} />
        </div>

        {/* Views */}
        <div className="flex items-center space-x-1">
          <FaEye />
          <span>{post.views}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
