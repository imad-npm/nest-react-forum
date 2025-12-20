import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import {
  FaEye,
  FaUser,
  FaUsers,
  FaRegCommentAlt,
  FaRegBookmark,
  FaBookmark,
  FaEdit, // Import FaEdit
  FaTrashAlt, // Import FaTrashAlt
} from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs'; // Import three dots icon
import Dropdown from '../../../shared/components/ui/Dropdown'; // Import Dropdown component
import { Button } from '../../../shared/components/ui/Button'; // Import Button component
import { PostReactionButtons } from '../../reactions/components/PostReactionButtons';
import { timeAgo } from '../../../shared/utils/date'; // Import timeAgo from shared utils

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const handleEditPost = () => {
    console.log('Edit post:', post.id);
    // TODO: Implement edit functionality
  };

  const handleDeletePost = () => {
    console.log('Delete post:', post.id);
    // TODO: Implement delete functionality
  };

  const handleToggleSave = () => {
    console.log(post.userSaved ? 'Unsave post:' : 'Save post:', post.id);
    // TODO: Implement save/unsave functionality
  };

  const handleShareClick = () => {
    console.log('Share clicked for post:', post.id);
    // TODO: Implement share functionality
  };

  const handleCommentClick = () => {
    console.log('Comment clicked for post:', post.id);
    // TODO: Implement navigation to post detail page comments or open comment modal
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg s border border-gray-300 hover:shadow-lg transition-shadow duration-200 mb-6 p-5">
      {/* Three dots dropdown */}
      <div className="absolute top-2 right-2">
        <Dropdown
          trigger={
            <Button variant="ghost" size="sm" className="p-2">
              <BsThreeDots className="text-lg text-gray-500 dark:text-gray-400" />
            </Button>
          }
          align="right"
        >
          <div className="py-1">
            <button
              onClick={handleEditPost}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              onClick={handleDeletePost}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <FaTrashAlt className="mr-2" /> Delete
            </button>
            <button
              onClick={handleToggleSave}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {post.userSaved ? (
                <>
                  <FaBookmark className="mr-2" /> Unsave
                </>
              ) : (
                <>
                  <FaRegBookmark className="mr-2" /> Save
                </>
              )}
            </button>
          </div>
        </Dropdown>
      </div>

      {/* Post Metadata */}
      <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 space-x-1">
        {post.community && (
          <>
            <FaUsers className="mr-1" />
            <Link
              to={`/communities/${post.community.id}`}
              className="font-semibold hover:underline mr-1"
            >
              c/{post.community.name}
            </Link>
            <span className="mx-1">•</span>
          </>
        )}
        <FaUser className="mr-1" />
        <span>u/{post.author.name}</span>
        <span className="mx-1">•</span>
        <span className="text-xs">{timeAgo(post.createdAt)}</span>
      </div>

      {/* Post Title */}
      <Link to={`/posts/${post.id}`}>
        <h2 className="text-lg  font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 leading-tight mb-2 line-clamp-2">
          {post.title}
        </h2>
      </Link>

      {/* Post Content */}
      <p className="text-gray-700 dark:text-gray-300 text-sm  line-clamp-3 mb-4">
        {post.content}
      </p>

      {/* Actions */}
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
    </div>
  );
};

export default PostCard;
