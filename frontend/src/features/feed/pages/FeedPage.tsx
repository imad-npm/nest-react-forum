// features/feed/pages/FeedPage.tsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useGetPostsInfiniteQuery } from '../../posts/services/postsApi';
import PostList from '../../posts/components/PostList';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import type { PostQueryDto } from '../../posts/types';
import FeedFilters from '../components/FeedFilters';

const FeedPage = () => {
  const [queryParams, setQueryParams] = useState<Omit<PostQueryDto, 'page'>>({
    limit: 10,
  });

  const {
    data,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useGetPostsInfiniteQuery(queryParams);

  
  const posts = data?.pages.flatMap((page) => page.data) ?? [];
  console.log(posts);

  const { showToast } = useToastContext();
  const observer = useRef<IntersectionObserver | null>(null);

  // Show error toast
  useEffect(() => {
    if (error) {
      showToast('Failed to load posts', 'error');
    }
  }, [error, showToast]);

  // Infinite scroll observer
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetching || !hasNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, hasNextPage, fetchNextPage]
  );

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Main Content Area */}
      <div className="md:w-3/4">
        <h1 className="text-3xl font-bold mb-6">Feed</h1>

        <FeedFilters
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          isLoading={isLoading}
        />

        <PostList posts={posts} isLoading={isLoading} error={undefined} />

        {/* Loading indicator */}
        {isFetching && (
          <div className="text-center mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading more posts...</p>
          </div>
        )}

        {/* End of feed */}
        {!hasNextPage && posts.length > 0 && (
          <div className="text-center mt-8 p-4 border-t">
            <p className="text-gray-600">🎉 You've reached the end!</p>
            <p className="text-sm text-gray-500 mt-1">No more posts to load</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center p-8">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to create a post!</p>
          </div>
        )}

        {/* Invisible element for intersection observer */}
        {hasNextPage && <div ref={lastPostElementRef} className="h-1" />}
      </div>

      {/* Sidebar */}
      <div className="md:w-1/4">
        {/* ... sidebar content ... */}
      </div>
    </div>
  );
};

export default FeedPage;
