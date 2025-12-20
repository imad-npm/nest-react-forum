import React from 'react';
import type { Post } from '../types';
import { Button } from '../../../shared/components/ui/Button';
import {
  FaRegCommentAlt,
  FaCommentAlt,
  FaRegBookmark,
  FaBookmark,
} from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';

interface PostActionButtonsProps {
  post: Post;
}

const PostActionButtons: React.FC<PostActionButtonsProps> = ({ post }) => {
  // Placeholder for actual action handlers
  const handleCommentClick = () => {
    console.log('Comment clicked for post:', post.id);
    // TODO: Implement navigation to post detail page comments or open comment modal
  };

  const handleShareClick = () => {
    console.log('Share clicked for post:', post.id);
    // TODO: Implement share functionality
  };

  const handleSaveClick = () => {
    console.log('Save clicked for post:', post.id);
    // TODO: Implement save/unsave functionality
  };

  return (
    <div className="flex items-center space-x-3 md:space-x-4">
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

      {/* Save Button */}
      <Button variant="secondary" size="sm" className="space-x-2" onClick={handleSaveClick}>
        {post.userSaved ? <FaBookmark className="text-primary-600" /> : <FaRegBookmark />}
        <span>Save</span>
      </Button>
    </div>
  );
};

export default PostActionButtons;
