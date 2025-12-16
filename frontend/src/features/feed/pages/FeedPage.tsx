import React, { useEffect } from 'react';
import { useGetPostsQuery } from '../../posts/services/postsApi';
import PostList from '../../posts/components/PostList';
import { useToastContext } from '../../../shared/providers/ToastProvider';

const FeedPage = () => {
  const { data, error, isLoading } = useGetPostsQuery({});
  const { showToast } = useToastContext();

 useEffect(() => {
    if (error) {
      const errorMessage = (error as any).data?.message || (error as any).message || 'Failed to load posts';
      showToast(errorMessage, 'error');
    }
  }, [error, showToast]); // run only when error changes

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Feed</h1>
      <PostList posts={data?.data || []} isLoading={isLoading} error={error} />
    </div>
  );
};

export default FeedPage;
