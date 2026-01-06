import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover.tsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';
import { useRef, useState, useMemo, type ChangeEvent, type KeyboardEvent } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { SearchResults } from '@/components/SearchResults.tsx';
import { filterSearchItems, getTotalResults } from '@/utilities/search.utilities.ts';
import { pageCategories } from '@/constants/page.constants.ts';

const POPOVER_ID = 'search-popover';
const INPUT_ID = 'search-input';

export default function Search() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(
    () => filterSearchItems(pageCategories, searchValue),
    [searchValue]
  );

  const totalResults = useMemo(
    () => getTotalResults(pageCategories, searchValue),
    [searchValue]
  );

  const handleWrapperMouseDown = () => {
    inputRef.current?.focus();
    if (!open) {
      setOpen(true);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    if (!open) {
      setOpen(true);
    }
  };

  const handlePopoverInteractOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-slot="popover-anchor"]')) {
      event.preventDefault();
    }
  };

  const handlePopoverEscape = () => {
    setOpen(false);
    inputRef.current?.focus();
  };

  const focusFirstItem = () => {
    const firstItem = document.querySelector(
      `#${POPOVER_ID} a[role="option"]`
    ) as HTMLElement;
    if (firstItem) {
      firstItem.focus();
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!open || filteredItems.length === 0) {
      return;
    }

    // Tab or ArrowDown moves focus to first item
    if (event.key === 'Tab' || event.key === 'ArrowDown') {
      event.preventDefault();
      setTimeout(() => focusFirstItem(), 0);
    }
  };

  return (
    <div className="w-64">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div onMouseDown={handleWrapperMouseDown}>
            <label htmlFor={INPUT_ID} className="sr-only">
              Search tools
            </label>
            <InputGroup>
              <InputGroupInput
                ref={inputRef}
                id={INPUT_ID}
                type="search"
                role="combobox"
                aria-expanded={open}
                aria-controls={open ? POPOVER_ID : undefined}
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-label="Search tools"
                placeholder="Search..."
                value={searchValue}
                onChange={handleInputChange}
                onFocus={() => setOpen(true)}
                onKeyDown={handleInputKeyDown}
              />
              <InputGroupAddon aria-hidden="true">
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </PopoverAnchor>
        <PopoverContent
          id={POPOVER_ID}
          role="listbox"
          className="w-[400px] p-0 max-h-[400px] overflow-y-auto"
          align="start"
          tabIndex={-1}
          onInteractOutside={handlePopoverInteractOutside}
          onEscapeKeyDown={handlePopoverEscape}
          onOpenAutoFocus={(e) => {
            // Prevent auto-focus on open, let the input keep focus
            e.preventDefault();
          }}
        >
          <SearchResults filteredItems={filteredItems} setOpen={setOpen} />
        </PopoverContent>
      </Popover>
      {open && searchValue && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {totalResults === 0
            ? 'No results found'
            : `${totalResults} ${totalResults === 1 ? 'result' : 'results'} found`}
        </div>
      )}
    </div>
  );
}