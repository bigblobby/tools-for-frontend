import { type RefObject, type KeyboardEvent } from 'react';
import type { FilteredSearchCategory, SearchItem } from '@/interfaces/search.interface.ts';

interface SearchResultsProps {
  filteredItems: FilteredSearchCategory[];
  onSelect: (path: string) => void;
  popoverId: string;
  inputRef: RefObject<HTMLInputElement | null>;
}

interface SearchResultItemProps {
  item: SearchItem;
  onSelect: (path: string) => void;
  popoverId: string;
  inputRef: RefObject<HTMLInputElement | null>;
}

const SearchResultItem = ({ item, onSelect, popoverId, inputRef }: SearchResultItemProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(item.path);
      return;
    }

    const items = Array.from(
      document.querySelectorAll(`#${popoverId} button[role="option"]`)
    ) as HTMLElement[];
    const currentIndex = items.indexOf(e.currentTarget);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < items.length - 1) {
        items[currentIndex + 1].focus();
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        items[currentIndex - 1].focus();
      } else {
        inputRef.current?.focus();
      }
      return;
    }
  };

  return (
    <button
      type="button"
      role="option"
      className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
      onClick={() => onSelect(item.path)}
      onKeyDown={handleKeyDown}
    >
      {item.title}
    </button>
  );
};

export const SearchResults = ({
  filteredItems,
  onSelect,
  popoverId,
  inputRef,
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
              onSelect={onSelect}
              popoverId={popoverId}
              inputRef={inputRef}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

