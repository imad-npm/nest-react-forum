import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import {
  FaEye,
  FaUser,
  FaUsers,
  FaRegCommentAlt,
} from 'react-icons/fa';
import { timeAgo } from '../../../shared/utils/date'; // Import timeAgo from shared utils
import PostDropdown from './PostCardDropdown'; // Import PostDropdown component
import PostCardFooter from './PostCardFooter';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
 

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg s border border-gray-300 hover:shadow-lg transition-shadow duration-200 mb-6 p-5">
      {/* Three dots dropdown */}
      <PostDropdown post={post} />

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
        <span className="text-xs">{timeAgo(post.createdAt)}</span>
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
   <PostCardFooter post={post}/>
    </div>
  );
};

export default PostCard;
