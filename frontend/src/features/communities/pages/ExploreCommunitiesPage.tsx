import React, { useState } from 'react';
import { useGetCommunitiesQuery } from '../services/communitiesApi';
import CommunityCard from '../components/CommunityCard';
import type { CommunityQueryDto } from '../types';

const ExploreCommunitiesPage: React.FC = () => {
  const [queryParams, setQueryParams] = useState<CommunityQueryDto>({
    limit: 10,
    page: 1,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, error } = useGetCommunitiesQuery(queryParams);

  const communities = data?.data || [];
  const meta = data?.meta;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQueryParams((prev) => ({ ...prev, name: searchTerm, page: 1 }));
  };

  const handleLoadMore = () => {
    if (meta?.hasNextPage) {
      setQueryParams((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  };

  if (isLoading && queryParams.page === 1) {
    return <div className="text-center mt-8">Loading communities...</div>;
  }

  if (isError) {
    console.error("Error loading communities:", error);
    return <div className="text-center mt-8 text-red-500">Error loading communities.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Explore Communities</h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Search communities by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Search
        </button>
      </form>

      {communities.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg mb-4">No communities found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}

      {meta?.hasNextPage && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {isLoading ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreCommunitiesPage;
