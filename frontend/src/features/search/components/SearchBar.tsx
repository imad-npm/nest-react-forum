import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Input } from '../../../shared/components/ui/Input';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    const timer = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, navigate]);

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className="relative flex-grow max-w-xl">
      <FaSearch
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-gray-400"
      />

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="
          h-10
          w-full
          rounded-lg
          border-gray-200
          bg-gray-50
          pl-10
          pr-12
          text-sm
          transition-all
          duration-150
          hover:bg-white
          focus:bg-white
          focus:border-gray-300
          focus:ring-2
          focus:ring-gray-200
        "
      />

      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded
            p-1
            text-gray-400
            hover:bg-gray-100
            hover:text-gray-600
          "
          aria-label="Clear search"
        >
          <FaTimes size={13} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;