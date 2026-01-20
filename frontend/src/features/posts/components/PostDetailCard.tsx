import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import { FaUser, FaUsers, FaEye } from 'react-icons/fa';
import { ReactionButtons } from '../../reactions/components/ReactionButtons';
import PostActionButtons from './PostCardFooter'; // Assuming it's in the same directory
import PostMetaData from './PostMetaData';
import PostCardFooter from './PostCardFooter';
import PostDropdown from './PostCardDropdown';

interface PostDetailCardProps {
  post: Post;
}

const PostDetailCard: React.FC<PostDetailCardProps> = ({ post }) => {
 

 
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg   mb-20 ">
      {/* Post Metadata */}
      
      {/* Three dots dropdown */}

      <div className="mb-2 relative flex justify-between">   
                    <PostMetaData post={post} />

           <PostDropdown post={post} />

 
      </div>  

      {/* Post Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
        {post.title}
      </h1>

    
<div 
className="text-gray-700 dark:text-gray-300 ProseMirror text-sm   mb-8"
      
    dangerouslySetInnerHTML={{ __html: post.content }} 
/>

      {/* Actions */}
       <PostCardFooter post={post}/>

    </div>
  );
};

export default PostDetailCard;
