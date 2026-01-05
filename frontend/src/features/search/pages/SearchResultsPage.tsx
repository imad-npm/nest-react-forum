import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetPostsInfiniteQuery } from '../../posts/services/postsApi';
import { useGetCommunitiesQuery } from '../../communities/services/communitiesApi';
import { useGetUsersQuery } from '../../user/services/userApiSlice';
import PostPreview from '../../posts/components/PostPreview';
import CommunityPreview from '../../communities/components/CommunityPreview';
import UserPreview from '../../user/components/UserPreview';
import type { Post } from '../../posts/types';
import type { UserResponseDto } from '../../auth/types';
import type { Community } from '../../communities/types';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'communities' | 'users'>('posts');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q'));
  }, [location.search]);

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
  } = useGetPostsInfiniteQuery({ search: searchQuery || '' }, { skip: !searchQuery || activeTab !== 'posts' });

  const {
    data: communitiesData,
    isLoading: communitiesLoading,
    isError: communitiesError,
  } = useGetCommunitiesQuery({ name: searchQuery || '' }, { skip: !searchQuery || activeTab !== 'communities' });

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetUsersQuery({ search: searchQuery || '' }, { skip: !searchQuery || activeTab !== 'users' });

  if (!searchQuery) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        <p>Please enter a search query.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Search Results for "{searchQuery}"</h1>

      <div className="flex border-b border-gray-300 mb-4">
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'posts' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'communities' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('communities')}
        >
          Communities
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'users' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      <div className="search-results-content">
        {activeTab === 'posts' && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Posts Results</h2>
            {postsLoading && <p>Loading posts...</p>}
            {postsError && <p>Error loading posts.</p>}
            {postsData && postsData.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.map((post: Post) => (
                  <PostPreview key={post.id} post={post} />
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
        {activeTab === 'communities' && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Communities Results</h2>
            {communitiesLoading && <p>Loading communities...</p>}
            {communitiesError && <p>Error loading communities.</p>}
            {communitiesData && communitiesData.data.map((community: Community) => (
              <CommunityPreview key={community.id} community={community} />
            ))}
          </div>
        )}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Users Results</h2>
            {usersLoading && <p>Loading users...</p>}
            {usersError && <p>Error loading users.</p>}
            {usersData && usersData.data.map((user: UserResponseDto) => (
              <UserPreview key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
