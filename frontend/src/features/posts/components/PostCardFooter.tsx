import React from 'react';
import type { Post } from '../types';
import { Button } from '../../../shared/components/ui/Button';
import {
  FaRegCommentAlt,
  FaCommentAlt,
  FaRegBookmark,
  FaBookmark,
  FaEye,
} from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { PostReactionButtons } from '../../reactions/components/PostReactionButtons';

interface PostCardFooterProps {
  post: Post;
}

 const PostCardFooter: React.FC<PostCardFooterProps> = ({ post }) => {
  // Placeholder for actual action handlers
  const handleCommentClick = () => {
    console.log('Comment clicked for post:', post.id);
    // TODO: Implement navigation to post detail page comments or open comment modal
  };

  const handleShareClick = () => {
    console.log('Share clicked for post:', post.id);
    // TODO: Implement share functionality
  };



  return (
    <div className="flex items-center justify-between mt-3  dark:text-gray-400 text-sm md:text-base">

      <div className="flex items-center space-x-3 md:space-x-4">

        {/* Vote Buttons */}
        <PostReactionButtons post={post} />


        {/* Comment Button */}
        <Button variant="secondary" size="sm" className="space-x-2" onClick={handleCommentClick}>
          <FaRegCommentAlt />
          <span>{post.commentsCount || 0}</span>
        </Button>

        {/* Share Button */}
        <Button variant="secondary" size="sm" className="space-x-2" onClick={handleShareClick}>
          <FiShare2 />
          <span>Share</span>
        </Button>
       

      </div>
       {/* Views */}
        <div className="flex items-center space-x-1">
          <FaEye />
          <span>{post.views}</span>
        </div>
    </div>
  );
};

export default PostCardFooter;
