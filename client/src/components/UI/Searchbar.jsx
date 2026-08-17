import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({
  searchQuery: controlledValue,
  setSearchQuery: controlledSet,
  onSearch,
  className = '',
  placeholder = 'Search products',
}) => {
  // Support uncontrolled usage when handlers aren't provided
  const [localQuery, setLocalQuery] = useState('');
  const searchQuery = typeof controlledValue === 'string' ? controlledValue : localQuery;
  const setSearchQuery = typeof controlledSet === 'function' ? controlledSet : setLocalQuery;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(e);
      }}
      className={className}
      role="search"
      aria-label="Site search"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="search"
          aria-label="Search products"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-500 border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
    </form>
  );
};

export default SearchBar;
