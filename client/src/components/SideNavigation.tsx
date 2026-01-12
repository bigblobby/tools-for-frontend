import { Link } from "@tanstack/react-router";
import { Sidebar, SidebarGroup, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { pageCategories } from '@/constants/page.constants.ts';
import type { PageItem } from "@/interfaces/search.interface";

export default function SideNavigation() {
  const { setOpenMobile } = useSidebar()

  const handleOpenMobile = () => {
    setOpenMobile(false)
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/">
          <h1 className="text-xl font-mono font-bold text-brand">
            Tools for Frontend
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {pageCategories.map((item) => (
          <SidebarGroup key={item.category}>
            <SidebarGroupLabel className="text-brand font-bold">{item.category}</SidebarGroupLabel>
            <SidebarMenu>
              {item.items.sort((a: PageItem, b: PageItem) => a.title.localeCompare(b.title)).map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild onClick={handleOpenMobile}>
                    <Link to={item.path}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-6">
        <a className="block text-center" href="https://www.buymeacoffee.com/bigblobby" target="_blank">
          <img className="h-10 mx-auto" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" />
        </a>
      </SidebarFooter>
    </Sidebar>
  )
}