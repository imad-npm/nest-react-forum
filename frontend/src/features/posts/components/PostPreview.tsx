import React from 'react';
import { type Post } from '../types';
import { Link } from 'react-router-dom';
import { FaUser, FaUsers } from 'react-icons/fa';

interface PostPreviewProps {
  post: Post;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        {post.community && (
          <div className="flex items-center mr-4">
            <FaUsers className="mr-1" />
            <Link to={`/communities/${post.community.id}`} className="font-bold hover:underline">
              {post.community.name}
            </Link>
          </div>
        )}
        <div className="flex items-center">
          <FaUser className="mr-1" />
          <span>Posted by</span>
          <Link to={`/profile/${post.author.id}`} className="ml-1 font-bold hover:underline">
            {post.author.username}
          </Link>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">
        <Link to={`/posts/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-700">{post.content.substring(0, 150)}...</p>
    </div>
  );
};

export default PostPreview;

