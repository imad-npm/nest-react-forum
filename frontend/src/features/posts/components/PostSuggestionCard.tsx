import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface PostSuggestionCardProps {
  post: Post;
}

export const PostSuggestionCard: React.FC<PostSuggestionCardProps> = ({ post }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
      <Link to={`/posts/${post.id}`} className="text-md font-semibold text-gray-800 hover:text-primary-600">
        {post.title}
      </Link>
      {post.community && (
        <p className="text-sm text-gray-500 mt-1">
          in <Link to={`/communities/${post.community.name}`} className="hover:underline">r/{post.community.name}</Link>
        </p>
      )}
      <p className="text-xs text-gray-400 mt-1">
        {post.views} views • {post.commentsCount} comments
      </p>
    </div>
  );
};
