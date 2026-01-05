import React from 'react';
import { Button } from '../../../shared/components/ui/Button';
import type { PostQueryDto } from '../../posts/types';
import { FaSortAmountDownAlt, FaFire } from 'react-icons/fa';
import DateRangeDropdown from './DateRangeDropdown';

interface FeedFiltersProps {
  queryParams: PostQueryDto;
  setQueryParams: React.Dispatch<React.SetStateAction<PostQueryDto>>;
  isLoading: boolean;
}

const FeedFilters: React.FC<FeedFiltersProps> = ({ queryParams, setQueryParams, isLoading }) => {
  const handleSortChange = (sortOption: 'popular' | 'published_at') => {
    setQueryParams((prev) => ({ ...prev, sort: sortOption, page: 1 }));
  };

  const handleDateRangeChange = (range: string) => {
    const now = new Date();
    let startDate: string | undefined;
    const endDate = now.toISOString();

    switch (range) {
      case 'past_day':
        now.setDate(now.getDate() - 1);
        startDate = now.toISOString();
        break;
      case 'past_week':
        now.setDate(now.getDate() - 7);
        startDate = now.toISOString();
        break;
      case 'past_month':
        now.setMonth(now.getMonth() - 1);
        startDate = now.toISOString();
        break;
      case 'past_year':
        now.setFullYear(now.getFullYear() - 1);
        startDate = now.toISOString();
        break;
      case 'all_time':
        startDate = undefined;
        break;
      default:
        startDate = undefined;
    }

    setQueryParams((prev) => ({
      ...prev,
      startDate,
      endDate: range !== 'all_time' ? endDate : undefined,
      page: 1,
    }));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg border border-gray-300 mb-6">
      <div className="flex space-x-2">
        <Button
          variant={queryParams.sort === 'published_at' ? 'default' : 'outline'}
          onClick={() => handleSortChange('published_at')}
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
      <div className="mt-4 sm:mt-0">
        <DateRangeDropdown onSelect={handleDateRangeChange} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default FeedFilters;
