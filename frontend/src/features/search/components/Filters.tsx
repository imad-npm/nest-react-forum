import React from 'react';
import { Button } from '../../../shared/components/ui/Button';
import type { PostQueryDto } from '../../posts/types';
import { FaSortAmountDownAlt, FaFire } from 'react-icons/fa';
import { Select, type SelectOption } from '../../../shared/components/ui/Select';

interface SearchFiltersProps {
  queryParams: PostQueryDto;
  setQueryParams: React.Dispatch<React.SetStateAction<PostQueryDto>>;
  isLoading: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ queryParams, setQueryParams, isLoading }) => {
  const handleSortChange = (sortOption: 'popular' | 'newest') => {
    setQueryParams((prev) => ({ ...prev, sort: sortOption, page: 1 }));
  };

  const handleDateRangeChange = (range: string | number) => {
    setQueryParams((prev) => ({
      ...prev,
      dateRange: range as string,
      page: 1,
    }));
  };

  const dateRangeOptions: SelectOption[] = [
    { label: 'All Time', value: 'all_time' },
    { label: 'Past Day', value: 'past_day' },
    { label: 'Past Week', value: 'past_week' },
    { label: 'Past Month', value: 'past_month' },
    { label: 'Past Year', value: 'past_year' },
  ];

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
      </div>
      <div className="mt-4 sm:mt-0 w-48">
        <Select
          options={dateRangeOptions}
          value={queryParams.dateRange || 'all_time'}
          onChange={handleDateRangeChange}
          placeholder="Filter by date"
        />
      </div>
    </div>
  );
};

export default SearchFilters;
