import { Link } from "@tanstack/react-router";
import { Sidebar, SidebarGroup, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import logo from "@/assets/react.svg"

export default function SideNavigation() {
  const { setOpenMobile } = useSidebar()

  const handleOpenMobile = () => {
    setOpenMobile(false)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/">
          <img src={logo} alt="Logo" width={40} height={40} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>String Utilities</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/string/count">Count</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/string/transform">Transform</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/string/encode-decode">Encode Decode</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/string/hash-generator">Hash Generator</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
  // return (
  //   <nav className="p-4">
  //     <ul className="flex flex-col gap-6">
  //       <li>
  //         <Link to="/">LOGO</Link>
  //       </li>
  //       <li className="flex flex-col gap-2">
  //         <span className="text-gray-200 flex items-center gap-2">
  //           <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4"><path d="M349.1 114.7C343.9 103.3 332.5 96 320 96C307.5 96 296.1 103.3 290.9 114.7L123.5 480L112 480C94.3 480 80 494.3 80 512C80 529.7 94.3 544 112 544L200 544C217.7 544 232 529.7 232 512C232 494.3 217.7 480 200 480L193.9 480L215.9 432L424.2 432L446.2 480L440.1 480C422.4 480 408.1 494.3 408.1 512C408.1 529.7 422.4 544 440.1 544L528.1 544C545.8 544 560.1 529.7 560.1 512C560.1 494.3 545.8 480 528.1 480L516.6 480L349.2 114.7zM394.8 368L245.2 368L320 204.8L394.8 368z" /></svg>String Utilities
  //         </span>
  //         <ul className="flex flex-col gap-1">
  //           <li className="text-gray-400 text-sm">
  //             <Link className="block px-3 py-2 rounded-md" to="/string/count" activeProps={{ className: "text-white bg-gray-800" }}>Count</Link>
  //           </li>
  //           <li className="text-gray-400 text-sm">
  //             <Link className="block px-3 py-2 rounded-md" to="/string/transform" activeProps={{ className: "text-white bg-gray-800" }}>Transform</Link>
  //           </li>
  //           <li className="text-gray-400 text-sm">
  //             <Link className="block px-3 py-2 rounded-md" to="/string/encode-decode" activeProps={{ className: "text-white bg-gray-800" }}>Encode Decode</Link>
  //           </li>
  //         </ul>
  //       </li>
  //     </ul>
  //   </nav>
  // );
}