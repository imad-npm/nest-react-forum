import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import {
  FaEye,
  FaUser,
  FaUsers,
  FaRegCommentAlt,
} from 'react-icons/fa';
import { timeAgo } from '../../../shared/utils/date'; // Import timeAgo from shared utils
import PostDropdown from './PostCardDropdown'; // Import PostDropdown component
import PostCardFooter from './PostCardFooter';
import PostMetaData from './PostMetaData';
import { Button } from '../../../shared/components/ui/Button';

interface PendingPostCardProps {
  post: Post;
approvePost: (postId: number) => void;
rejectPost: (postId: number) => void;

}

const PendingPostCard: React.FC<PendingPostCardProps> = ({ post,approvePost,rejectPost }) => {
 

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg s border border-gray-300 hover:shadow-lg transition-shadow duration-200 mb-6 p-5">
       
       <div className="mb-2 relative flex justify-between">   
                    <PostMetaData post={post} />

           <PostDropdown post={post} />

 
      </div>  


      {/* Post Title */}
      <Link to={`/posts/${post.id}`}>
        <h2 className="text-lg  font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 leading-tight mb-2 line-clamp-2">
          {post.title}
        </h2>
      </Link>

      {/* Post Content */}

<div 
className="text-gray-700 dark:text-gray-300 text-sm  line-clamp-3 mb-4"
      
    dangerouslySetInnerHTML={{ __html: post.content }} 
/>
      {/* Actions */}

  <div className="flex gap-2">
              <Button size="sm" onClick={() => approvePost(post.id)} className="bg-green-600 hover:bg-green-700">Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => rejectPost(post.id)} 
              >Reject</Button>
            </div>

    </div>
  );
};

export default PendingPostCard;
