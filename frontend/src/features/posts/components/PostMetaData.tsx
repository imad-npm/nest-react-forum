import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { timeAgo } from '../../../shared/utils/date';

interface PostMetaProps {
  post: Post;
}

const PostMetaData: React.FC<PostMetaProps> = ({ post }) => {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 leading-none">
      {post.community && (
        <>
          <Link
            to={`/communities/${post.community.id}`}
            className="font-semibold text-gray-600 dark:text-gray-100 hover:underline"
          >
            c/{post.community.name}
          </Link>
          <span className="select-none">•</span>
        </>
      )}

      <span>Posted by</span>

      <Link
        to={`/users/${post.author.username}`}
        className="hover:underline"
      >
        u/{post.author.username}
      </Link>

      {post.publishedAt && (
        <>
          <span className="select-none">•</span>
          <span>{timeAgo(post.publishedAt)}</span>
        </>
      )}
    </div>
  );
};

export default PostMetaData;
