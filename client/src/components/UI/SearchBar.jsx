import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  </form>
);

export default SearchBar;