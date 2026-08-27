import React, { useEffect, useRef, useState } from 'react';

interface SearchableSelectProps<T> {
  value: string;
  onSearch: (term: string) => void;
  options: T[];
  loading?: boolean;
  onSelect: (item: T) => void;
  getLabel: (item: T) => string;
  renderOption?: (item: T) => React.ReactNode;
  placeholder?: string;
}
const SearchableSelect = <T extends { id: string | number }>({
  value,
  onSearch,
  options,
  loading = false,
  onSelect,
  getLabel,
  renderOption,
  placeholder = 'Search...',
}: SearchableSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(value);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input
        value={searchValue}
        onChange={(e) => {
          const text = e.target.value;

          setSearchValue(text);
          onSearch(text);
          setOpen(true);
        }}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2"
      />

      {open && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow">
          {loading && (
            <li className="px-3 py-2 text-sm text-gray-500">
              Loading…
            </li>
          )}

          {!loading && options.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-500">
              No results
            </li>
          )}

          {!loading &&
            options.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  onSelect(item);

                  const label = getLabel(item);
                  setSearchValue(label);
                  onSearch(label);

                  setOpen(false);
                }}
                className="cursor-pointer px-3 py-2 hover:bg-primary-600 hover:text-white"
              >
                {renderOption
                  ? renderOption(item)
                  : getLabel(item)}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
export default SearchableSelect;
