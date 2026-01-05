import { Link, Outlet, useLocation } from '@tanstack/react-router';
import SideNavigation from "@/components/SideNavigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useMostRecentPages from '@/hooks/useMostRecentPages.ts';
import useMostUseTools from '@/hooks/use-most-used-tools.ts';
import { Button } from '@/components/ui/button.tsx';
import { MoveLeft } from 'lucide-react';

export default function BaseLayout() {
  const location = useLocation();
  useMostRecentPages();
  useMostUseTools();
  
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <SideNavigation />
        <main className="flex-1 h-dvh overflow-y-auto">
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