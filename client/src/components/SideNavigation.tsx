import { Link } from "@tanstack/react-router";
import { Sidebar, SidebarGroup, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

export default function SideNavigation() {
  const { setOpenMobile } = useSidebar()

  const handleOpenMobile = () => {
    setOpenMobile(false)
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/">
          <h1 className="text-xl font-mono font-bold text-blue-800">
            Tools for Frontend
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-900">String Utilities</SidebarGroupLabel>
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
                <Link to="/string/case-converter">Case Converter</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/string/encode-decode">Encode Decode</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/string/jwt-decoder">JWT Decoder</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/string/json-formatter">JSON Formatter</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/string/hash-generator">Hash Generator</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-900">Color Utilities</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/color/converter">Converter</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-900">Converter Utilities</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/converter/xml-to-json">XML to JSON</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/converter/json-to-xml">JSON to XML</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-900">Date/Time Utilities</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/date-time/epoch-unix">Epoch/Unix Converter</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-900">Image Tools</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/image/base64">Image to Base64</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/image/optimise">Image optimiser</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/image/placeholder">Placeholder images</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleOpenMobile}>
                <Link to="/image/favicon-generator">Favicon Generator</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <a className="block text-center" href="https://www.buymeacoffee.com/bigblobby" target="_blank">
          <img className="h-10 mx-auto" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" />
        </a>
      </SidebarFooter>
    </Sidebar>
  )
}