import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import { FaUser, FaUsers, FaEye } from 'react-icons/fa';
import { PostReactionButtons } from '../../reactions/components/PostReactionButtons';
import PostActionButtons from './PostCardFooter'; // Assuming it's in the same directory
import PostMetaData from './PostMetaData';
import PostCardFooter from './PostCardFooter';

interface PostDetailCardProps {
  post: Post;
}

const PostDetailCard: React.FC<PostDetailCardProps> = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg   mb-20 ">
      {/* Post Metadata */}
     <PostMetaData post={post} />

      {/* Post Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
        {post.title}
      </h1>

      {/* Post Content */}
      <p className="text-gray-700 dark:text-gray-300 text-base mb-6  leading-[1.8] ">
        {post.content}
      </p>

      {/* Actions */}
       <PostCardFooter post={post}/>

    </div>
  );
};

export default PostDetailCard;
