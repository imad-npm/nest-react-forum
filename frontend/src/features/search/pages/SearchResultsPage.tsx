import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetPostsInfiniteQuery } from '../../posts/services/postsApi';
import { useGetCommunitiesQuery } from '../../communities/services/communitiesApi';
import { useGetUsersQuery } from '../../user/services/userApiSlice';
import type { UserResponseDto } from '../../auth/types';
import type { Community } from '../../communities/types';
import type { Post } from '../../posts/types';

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
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'communities' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('communities')}
        >
          Communities
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
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
                  <div key={post.id} className="p-4 border-b">
                    <h3 className="text-xl font-bold">{post.title}</h3>
                    <p>{post.content}</p>
                  </div>
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
              <div key={community.id} className="p-4 border-b">
                <h3 className="text-xl font-bold">{community.name}</h3>
                <p>{community.description}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Users Results</h2>
            {usersLoading && <p>Loading users...</p>}
            {usersError && <p>Error loading users.</p>}
            {usersData && usersData.data.map((user: UserResponseDto) => (
              <div key={user.id} className="p-4 border-b">
                <h3 className="text-xl font-bold">{user.username}</h3>
                <p>{user.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
