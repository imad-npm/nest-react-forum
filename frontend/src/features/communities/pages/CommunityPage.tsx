import React from 'react';
import { useParams } from 'react-router-dom';
import { CommunityHeader } from '../components/CommunityHeader';
import PostList from '../../posts/components/PostList';
import { useGetPostsInfiniteQuery } from '../../posts/services/postsApi';

export const CommunityPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const communityIdNumber = +(communityId || 0);

  const {
    data: postsData,
    error: postsError,
    isLoading: postsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPostsInfiniteQuery({ communityId: communityIdNumber });

  const posts = postsData?.pages.flatMap((page) => page.data) || [];

  return (
    <>
    <div className="mb-8">
            <CommunityHeader communityId={communityIdNumber}  />

    </div>

      <PostList posts={posts} isLoading={postsLoading} error={postsError} />
    </>
  );
};

