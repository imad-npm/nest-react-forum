import React from 'react';
import { Button } from '../../../shared/components/ui/Button';
import type { PostQueryDto } from '../../posts/types';
import { FaSortAmountDownAlt, FaFire, FaCalendarAlt } from 'react-icons/fa';

interface FeedFiltersProps {
  queryParams: PostQueryDto;
  setQueryParams: React.Dispatch<React.SetStateAction<PostQueryDto>>;
  isLoading: boolean;
}


const FeedFilters: React.FC<FeedFiltersProps> = ({ queryParams, setQueryParams, isLoading }) => {
console.log(queryParams);

  const handleSortChange = (sortOption: string) => {
    setQueryParams((prev) => ({ ...prev, sort: sortOption, page: 1 }));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg border border-gray-300 mb-6">
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
        <Button
          variant={queryParams.sort === 'published_at' ? 'default' : 'outline'}
          onClick={() => handleSortChange('published_at')}
          disabled={isLoading}
          className="flex items-center space-x-1"
        >
          <FaCalendarAlt /> <span>Published</span>
        </Button>
      </div>
    </div>
  );
};

export default FeedFilters;
