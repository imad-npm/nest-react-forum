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
import { Button } from '../../../shared/components/ui/Button';

interface PostCardProps {
  post: Post;
}

// Pure JS time ago
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
        <span>{timeAgo(post.createdAt)}</span>
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

          {/* Comment */}
          <Button variant="secondary" size="sm" className='space-x-2'>
             <FaRegCommentAlt />
            <span>{post.commentsCount || 0}</span>
          </Button>

          {/* Share */}
          <Button variant="secondary" size="sm" className='space-x-2'>
            <FiShare2 />
            <span>Share</span>
          </Button>

          {/* Save */}
          <Button variant="secondary" size="sm" className='space-x-2'>
            {post.userSaved ? <FaBookmark className="text-primary-600" /> : <FaRegBookmark />}
            <span>Save</span>
          </Button>
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
