import React from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import type { PostQueryDto } from '../../posts/types';

interface FeedFiltersProps {
  queryParams: PostQueryDto;
  setQueryParams: React.Dispatch<React.SetStateAction<PostQueryDto>>;
  isLoading: boolean;
}

const FeedFilters: React.FC<FeedFiltersProps> = ({ queryParams, setQueryParams, isLoading }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleSortChange = (sortOption: string) => {
    setQueryParams((prev) => ({ ...prev, sort: sortOption, page: 1 }));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
      <Input
        placeholder="Search posts..."
        className="mb-3 sm:mb-0 sm:mr-4 flex-grow"
        onChange={handleSearchChange}
        value={queryParams.search || ''}
      />
      <div className="flex space-x-2">
        <Button
          variant={queryParams.sort === 'newest' ? 'default' : 'outline'}
          onClick={() => handleSortChange('newest')}
          disabled={isLoading}
        >
          Newest
        </Button>
        <Button
          variant={queryParams.sort === 'popular' ? 'default' : 'outline'}
          onClick={() => handleSortChange('popular')}
          disabled={isLoading}
        >
          Popular
        </Button>
      </div>
    </div>
  );
};

export default FeedFilters;
