import { Outlet } from '@tanstack/react-router';
import SideNavigation from "@/components/SideNavigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useMostRecentPages from '@/hooks/useMostRecentPages.ts';
import useMostUseTools from '@/hooks/use-most-used-tools.ts';

export default function BaseLayout() {
  useMostRecentPages();
  useMostUseTools();
  
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <SideNavigation />
        <main className="flex-1 h-dvh overflow-y-auto">
          <div className="p-4 md:p-8">
            <SidebarTrigger className="md:hidden mb-4" />
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}