import Sidebar from "../layout/Sidebar";
import { kasirMenus } from "../role-menu/SidebarMenu";
import { Outlet } from "react-router-dom";
import DateTimeDisplay from "../components/DateTimeDisplay";

function KasirLayout() {
  return (
    <div className="bg-gray-100 flex h-screen">
      <Sidebar menus={kasirMenus} />

      <main
        id="page-content"
        className="flex-1 overflow-y-auto"
      >
        <div className="px-3 sm:px-4 md:px-8 pt-3 md:pt-5 flex">
          <div className="ml-auto mr-5">
            <DateTimeDisplay />
          </div>
        </div>

        <div className="px-3 sm:px-4 md:px-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default KasirLayout;