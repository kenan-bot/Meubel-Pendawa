import Sidebar from "../layout/Sidebar";
import { ownerMenus } from "../role-menu/SidebarMenu";
import { Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";

function OwnerLayout() {
  return (
    <div className="bg-gray-100 flex h-screen">

      <Sidebar menus={ownerMenus} />

      <main className="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}

export default OwnerLayout;