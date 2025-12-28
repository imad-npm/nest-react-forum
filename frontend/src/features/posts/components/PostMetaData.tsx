import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUser } from 'react-icons/fa';

import type { Post } from '../types';
import { timeAgo } from '../../../shared/utils/date';

interface PostMetaProps {
  post: Post;
}

const PostMetaData: React.FC<PostMetaProps> = ({ post }) => {
  return (
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

      {post.publishedAt && (
        <>
          <span className="mx-1">•</span>
          <span className="text-xs">
            Published {timeAgo(post.publishedAt)}
          </span>
        </>
      )}
    </div>
  );
};

export default PostMetaData;
