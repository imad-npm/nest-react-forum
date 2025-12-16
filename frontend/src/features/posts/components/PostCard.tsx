import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaEye, FaUser, FaUsers } from 'react-icons/fa';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <Link to={`/posts/${post.id}`}>
        <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 text-sm mt-1 flex items-center space-x-1">
        <FaUser className="inline-block text-gray-500" />
        <span>Posted by {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</span>
        {post.community && (
          <span className="flex items-center space-x-1 ml-2">
            <FaUsers className="inline-block text-gray-500" />
            <span>in <Link to={`/communities/${post.community.id}`} className="text-blue-500 hover:underline">{post.community.name}</Link></span>
          </span>
        )}
      </p>
      <p className="text-gray-700 mt-2 line-clamp-3">{post.content}</p>
      <div className="flex items-center mt-3 text-gray-500 text-sm space-x-4">
        <span className="flex items-center space-x-1">
          <FaThumbsUp /> <span>{post.likesCount}</span>
        </span>
        <span className="flex items-center space-x-1">
          <FaThumbsDown /> <span>{post.dislikesCount}</span>
        </span>
        <span className="flex items-center space-x-1">
          <FaEye /> <span>{post.views}</span>
        </span>
      </div>
    </div>
  );
};

export default PostCard;
