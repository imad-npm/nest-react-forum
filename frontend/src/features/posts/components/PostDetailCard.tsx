import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import { FaUser, FaUsers, FaEye } from 'react-icons/fa';
import { PostReactionButtons } from '../../reactions/components/PostReactionButtons';
import PostActionButtons from './PostActionButtons'; // Assuming it's in the same directory

interface PostDetailCardProps {
  post: Post;
}

// Pure JS time ago (re-using from PostCard for now)
const timeAgo = (dateString: string) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

const PostDetailCard: React.FC<PostDetailCardProps> = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg  p-6 mb-6 border border-gray-300">
      {/* Post Metadata */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-1">
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
        <span>{timeAgo(post.createdAt)}</span>
      </div>

      {/* Post Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
        {post.title}
      </h1>

      {/* Post Content */}
      <p className="text-gray-700 dark:text-gray-300 text-base mb-6">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <div className="flex items-center space-x-4">
          <PostReactionButtons post={post} />
          <PostActionButtons post={post} />
        </div>

        {/* Views */}
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <FaEye />
          <span>{post.views} Views</span>
        </div>
      </div>
    </div>
  );
};

export default PostDetailCard;
