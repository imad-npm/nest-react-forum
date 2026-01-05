import PostList from '../../posts/components/PostList';
import SuggestedCommunities from '../../communities/components/SuggestedCommunities';
import { useFeed } from '../hooks/useFeed';

const FeedPage = () => {
  const {
    posts,
    isLoading,
    isFetching,
    hasNextPage,
    lastPostElementRef,
  } = useFeed();

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Main Content Area */}
      <div className="md:w-3/4">
        <h1 className="text-3xl font-bold mb-6">Feed</h1>

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
        <SuggestedCommunities />
      </div>
    </div>
  );
};

export default FeedPage;
