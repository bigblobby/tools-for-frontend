import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import SideNavigation from "@/components/SideNavigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useMostRecentPages from '@/hooks/useMostRecentPages.ts';
import useMostUseTools from '@/hooks/use-most-used-tools.ts';
import { Button } from '@/components/ui/button.tsx';
import { MoveLeft, Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover.tsx';
import { useRef, useState } from 'react';

const searchItems = [
  {
    category: 'String Utilities',
    items: [
      { title: 'Count', path: '/string/count' },
      { title: 'Transform', path: '/string/transform' },
      { title: 'Case Converter', path: '/string/case-converter' },
      { title: 'Encode Decode', path: '/string/encode-decode' },
      { title: 'JWT Decoder', path: '/string/jwt-decoder' },
      { title: 'JSON Formatter', path: '/string/json-formatter' },
      { title: 'Hash Generator', path: '/string/hash-generator' },
    ]
  },
  {
    category: 'Color Utilities',
    items: [
      { title: 'Color Converter', path: '/color/converter' },
    ]
  },
  {
    category: 'Converters',
    items: [
      { title: 'XML to JSON', path: '/converter/xml-to-json' },
      { title: 'JSON to XML', path: '/converter/json-to-xml' },
    ]
  },
  {
    category: 'Date & Time',
    items: [
      { title: 'Epoch Unix Date Time Converter', path: '/date-time/epoch-unix' },
    ]
  },
  {
    category: 'Image Utilities',
    items: [
      { title: 'Image to Base64', path: '/image/base64' },
      { title: 'Image Optimiser', path: '/image/optimise' },
      { title: 'Placeholder Image Generator', path: '/image/placeholder' },
      { title: 'Favicon Generator', path: '/image/favicon-generator' },
    ]
  }
];

export default function BaseLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  useMostRecentPages();
  useMostUseTools();

  const inputRef = useRef<HTMLInputElement>(null);
  const popoverId = 'search-popover';
  const inputId = 'search-input';

  const handleSelect = (path: string) => {
    void navigate({ to: path });
    setOpen(false);
    setSearchValue('');
  };

  const handleWrapperMouseDown = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Tab' && open) {
      // When tabbing from input and popover is open, move to first item
      e.preventDefault();
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const firstItem = document.querySelector(`#${popoverId} button[role="option"]`) as HTMLElement;
        if (firstItem) {
          firstItem.focus();
        }
      }, 0);
    } else if (e.key === 'ArrowDown' && open) {
      e.preventDefault();
      const firstItem = document.querySelector(`#${popoverId} button[role="option"]`) as HTMLElement;
      if (firstItem) {
        firstItem.focus();
      }
    }
  };

  // Count total results for screen reader announcement
  const totalResults = searchItems.reduce((acc, group) => {
    return acc + group.items.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    ).length;
  }, 0);


  return (
    <SidebarProvider>
      <div className="flex w-full">
        <SideNavigation />
        <main className="flex-1 h-dvh overflow-y-auto">
          <div className="border-b p-3">
            <div className="w-64">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverAnchor asChild>
                  <div onMouseDown={handleWrapperMouseDown}>
                    <label htmlFor={inputId} className="sr-only">
                      Search tools
                    </label>
                    <InputGroup>
                      <InputGroupInput
                        ref={inputRef}
                        id={inputId}
                        type="search"
                        role="combobox"
                        aria-expanded={open}
                        aria-controls={open ? popoverId : undefined}
                        aria-autocomplete="list"
                        aria-haspopup="listbox"
                        aria-label="Search tools"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => {
                          setSearchValue(e.target.value);
                          if (!open) setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                      />
                      <InputGroupAddon aria-hidden="true">
                        <Search />
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </PopoverAnchor>
                <PopoverContent
                  id={popoverId}
                  role="listbox"
                  className="w-[400px] p-0 max-h-[400px] overflow-y-auto"
                  align="start"
                  tabIndex={-1}
                  onInteractOutside={(e) => {
                    // Prevent closing when clicking on the input
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-slot="popover-anchor"]')) {
                      e.preventDefault();
                    }
                  }}
                  onEscapeKeyDown={() => {
                    setOpen(false);
                    inputRef.current?.focus();
                  }}
                  onOpenAutoFocus={(e) => {
                    // Prevent auto-focus on open, let the input keep focus
                    e.preventDefault();
                  }}
                >
                  {(() => {
                    const allFilteredItems = searchItems.flatMap((group) => {
                      const filtered = group.items.filter((item) =>
                        item.title.toLowerCase().includes(searchValue.toLowerCase())
                      );
                      return filtered.length > 0 ? [{ category: group.category, items: filtered }] : [];
                    });

                    if (allFilteredItems.length === 0) {
                      return (
                        <div className="py-6 text-center text-sm text-muted-foreground" role="option" aria-label="No results found">
                          No results found.
                        </div>
                      );
                    }

                    return (
                      <div className="p-1">
                        {allFilteredItems.map((group) => (
                          <div key={group.category} className="mb-2">
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                              {group.category}
                            </div>
                            {group.items.map((item) => (
                              <button
                                key={item.path}
                                type="button"
                                role="option"
                                className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                                onClick={() => handleSelect(item.path)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleSelect(item.path);
                                  } else if (e.key === 'Tab' && !e.shiftKey) {
                                    // Tab forward - move to next item or allow default if last
                                    const items = Array.from(
                                      document.querySelectorAll(`#${popoverId} button[role="option"]`)
                                    ) as HTMLElement[];
                                    const currentIndex = items.indexOf(e.currentTarget);
                                    if (currentIndex < items.length - 1) {
                                      e.preventDefault();
                                      items[currentIndex + 1].focus();
                                    }
                                    // If it's the last item, allow default tab behavior
                                  } else if (e.key === 'Tab' && e.shiftKey) {
                                    // Shift+Tab - move to previous item or back to input
                                    const items = Array.from(
                                      document.querySelectorAll(`#${popoverId} button[role="option"]`)
                                    ) as HTMLElement[];
                                    const currentIndex = items.indexOf(e.currentTarget);
                                    if (currentIndex > 0) {
                                      e.preventDefault();
                                      items[currentIndex - 1].focus();
                                    } else {
                                      e.preventDefault();
                                      inputRef.current?.focus();
                                    }
                                  } else if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    const items = Array.from(
                                      document.querySelectorAll(`#${popoverId} button[role="option"]`)
                                    ) as HTMLElement[];
                                    const currentIndex = items.indexOf(e.currentTarget);
                                    if (currentIndex < items.length - 1) {
                                      items[currentIndex + 1].focus();
                                    }
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    const items = Array.from(
                                      document.querySelectorAll(`#${popoverId} button[role="option"]`)
                                    ) as HTMLElement[];
                                    const currentIndex = items.indexOf(e.currentTarget);
                                    if (currentIndex > 0) {
                                      items[currentIndex - 1].focus();
                                    } else {
                                      inputRef.current?.focus();
                                    }
                                  }
                                }}
                              >
                                {item.title}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
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
          </div>

          <div className="p-4 md:p-8">
            <SidebarTrigger className="md:hidden mb-4" />
            {location.pathname !== '/' && (
              <div className="mb-4">
                <Button variant="link" className="px-0 has-[>svg]:px-0 py-0 h-auto" asChild>
                  <Link to="/"><MoveLeft /> Back to Homepage</Link>
                </Button>
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}