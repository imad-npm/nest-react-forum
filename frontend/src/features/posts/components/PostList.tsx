import React from 'react';
import PostCard from './PostCard';
import type { Post } from '../types';

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  error: any; // Ideally, a more specific error type
}

const PostList: React.FC<PostListProps> = ({ posts, isLoading, error }) => {
  if (isLoading) {
    return <div className="text-center mt-8">Loading posts...</div>;
  }

  if (error) {
    // Error handling will be done in the parent FeedPage
    return <div className="text-center mt-8 text-red-500">Error loading posts.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-600 mt-8">No posts found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
