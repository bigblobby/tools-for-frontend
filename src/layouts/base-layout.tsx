import { Outlet } from "@tanstack/react-router";
import SideNavigation from "../components/SideNavigation";

export default function BaseLayout() {
  return (
    <div className="flex">
      <aside className="max-w-[200px] min-w-[200px] bg-gray-900 text-white h-screen">
        <SideNavigation />
      </aside>
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="p-4 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}