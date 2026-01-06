import type { SearchItem, SearchResultItemProps, SearchResultsProps } from '@/interfaces/search.interface.ts';
import { Link } from '@tanstack/react-router';

const SearchResultItem = ({ item }: SearchResultItemProps) => {
  return (
    <Link
      type="button"
      role="option"
      to={item.path}
      className="block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
    >
      {item.title}
    </Link>
  );
};

export const SearchResults = ({
  filteredItems,
}: SearchResultsProps) => {
  if (filteredItems.length === 0) {
    return (
      <div
        className="py-6 text-center text-sm text-muted-foreground"
        role="option"
        aria-label="No results found"
      >
        No results found.
      </div>
    );
  }

  return (
    <div className="p-1">
      {filteredItems.map((group) => (
        <div key={group.category} className="mb-2">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            {group.category}
          </div>
          {group.items.map((item: SearchItem) => (
            <SearchResultItem
              key={item.path}
              item={item}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

