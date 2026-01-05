import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import SideNavigation from "@/components/SideNavigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useMostRecentPages from '@/hooks/useMostRecentPages.ts';
import useMostUseTools from '@/hooks/use-most-used-tools.ts';
import { Button } from '@/components/ui/button.tsx';
import { MoveLeft, Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover.tsx';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command.tsx';
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
                    <InputGroup>
                      <InputGroupInput
                        ref={inputRef}
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => {
                          setSearchValue(e.target.value);
                          if (!open) setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                      />
                      <InputGroupAddon>
                        <Search />
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </PopoverAnchor>
                <PopoverContent
                  className="w-[400px] p-0"
                  align="start"
                  onInteractOutside={(e) => {
                    // Prevent closing when clicking on the input
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-slot="popover-anchor"]')) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Command shouldFilter={false}>
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      {searchItems.map((group) => {
                        const filteredItems = group.items.filter((item) =>
                          item.title.toLowerCase().includes(searchValue.toLowerCase())
                        );

                        if (filteredItems.length === 0) return null;

                        return (
                          <CommandGroup key={group.category} heading={group.category}>
                            {filteredItems.map((item) => (
                              <CommandItem
                                key={item.path}
                                value={item.title}
                                onSelect={() => handleSelect(item.path)}
                              >
                                {item.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        );
                      })}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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