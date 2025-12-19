import React from 'react';
import { useGetPostsInfiniteQuery } from '../services/postsApi';
import { PostSuggestionCard } from './PostSuggestionCard';

interface PostSuggestionsListProps {
  currentPostId: number;
  communityId?: number; // Optional: to suggest posts from the same community
}

export const PostSuggestionsList: React.FC<PostSuggestionsListProps> = ({ currentPostId, communityId }) => {
  const { data, error, isLoading } = useGetPostsInfiniteQuery({
    communityId: communityId,
    limit: 5, // Fetch 5 suggestions
  });

  // Flatten the pages array to get all posts
  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  // Filter out the current post from suggestions
  const suggestions = allPosts.filter(post => post.id !== currentPostId);

  if (isLoading) {
    return <p>Loading suggestions...</p>;
  }

  if (error) {
    return <p>Error loading suggestions.</p>;
  }

  if (suggestions.length === 0) {
    return <p>No suggestions found.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">More Posts Like This</h2>
      <div className="flex flex-col gap-3">
        {suggestions.map((post) => (
          <PostSuggestionCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

