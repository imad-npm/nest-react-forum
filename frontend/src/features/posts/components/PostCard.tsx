import React from 'react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';
import {
  FaEye,
  FaUser,
  FaUsers,
  FaCommentAlt, // Comment icon
  FaShareAlt, // Share icon
  FaBookmark, // Save icon
} from 'react-icons/fa';
import { PostReactionButtons } from '../../reactions';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mb-6 p-5">
      {/* Post Metadata (Author, Community, Date) */}
      <div className="flex items-center text-sm text-gray-500 mb-3">
        {post.community && (
          <>
            <FaUsers className="mr-1" />
            <Link
              to={`/communities/${post.community.id}`}
              className="font-semibold hover:underline mr-2"
            >
              c/{post.community.name}
            </Link>
            <span className="mx-1">•</span>
          </>
        )}
        <FaUser className="mr-1" />
        <span>Posted by u/{post.author.name}</span>
        <span className="mx-1">•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Post Title */}
      <Link to={`/posts/${post.id}`}>
        <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 leading-tight mb-3">
          {post.title}
        </h2>
      </Link>
      {/* Post Content */}
      <p className="text-gray-700 text-sm line-clamp-3 mb-4">{post.content}</p>

      {/* Action Buttons and Votes */}
      <div className="flex items-center justify-between mt-3 text-gray-500 text-sm">
        <div className="flex items-center space-x-4">
          {/* Vote Buttons */}
          <PostReactionButtons
            postId={post.id}
            initialLikesCount={post.likesCount}
            initialDislikesCount={post.dislikesCount}
            initialUserReaction={post.userReaction}
          />

          {/* Other Action Buttons */}
          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
            <FaCommentAlt /> <span>{post.commentsCount || 0} Comments</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
            <FaShareAlt /> <span>Share</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
            <FaBookmark /> <span>Save</span>
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <FaEye /> <span>{post.views}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
