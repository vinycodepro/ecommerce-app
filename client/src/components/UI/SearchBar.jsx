import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, className }) => (
  <form onSubmit={onSearch} className={className}>
    <div className="relative">
      <input
        type="text"
        placeholder="Search products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

    </div>
  </form>
);

export default SearchBar;