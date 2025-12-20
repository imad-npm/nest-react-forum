import React from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import type { PostQueryDto } from '../../posts/types';
import { FaSearch, FaSortAmountDownAlt, FaFire } from 'react-icons/fa';

interface FeedFiltersProps {
  queryParams: PostQueryDto;
  setQueryParams: React.Dispatch<React.SetStateAction<PostQueryDto>>;
  isLoading: boolean;
}


const FeedFilters: React.FC<FeedFiltersProps> = ({ queryParams, setQueryParams, isLoading }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };
console.log(queryParams);

  const handleSortChange = (sortOption: string) => {
    setQueryParams((prev) => ({ ...prev, sort: sortOption, page: 1 }));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg border border-gray-300 mb-6">
      <div className="relative flex-grow mb-3 sm:mb-0 sm:mr-4">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search posts..."
          className="pl-10 w-full"
          onChange={handleSearchChange}
          value={queryParams.search || ''}
        />
      </div>
      <div className="flex space-x-2">
        <Button
          variant={queryParams.sort === 'newest' ? 'default' : 'outline'}
          onClick={() => handleSortChange('newest')}
          disabled={isLoading}
          className="flex items-center space-x-1"
        >
          <FaSortAmountDownAlt /> <span>Newest</span>
        </Button>
        <Button
          variant={queryParams.sort === 'popular' ? 'default' : 'outline'}
          onClick={() => handleSortChange('popular')}
          disabled={isLoading}
          className="flex items-center space-x-1"
        >
          <FaFire /> <span>Popular</span>
        </Button>
      </div>
    </div>
  );
};

export default FeedFilters;
