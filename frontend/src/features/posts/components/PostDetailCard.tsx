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
      <div className="mb-2">
            <PostMetaData post={post} />
 
      </div>

      {/* Post Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
        {post.title}
      </h1>

    
<div 
className="text-gray-700 dark:text-gray-300 text-sm  line-clamp-3 mb-8"
      
    dangerouslySetInnerHTML={{ __html: post.content }} 
/>

      {/* Actions */}
       <PostCardFooter post={post}/>

    </div>
  );
};

export default PostDetailCard;
