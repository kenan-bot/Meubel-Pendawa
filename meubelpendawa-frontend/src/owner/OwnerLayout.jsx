import Sidebar from "../layout/Sidebar";
import { ownerMenus } from "../role-menu/SidebarMenu";
import { Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";

function OwnerLayout(){

    return(
        <div className="flex">
            <Sidebar menus={ownerMenus}/>
            
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    )

}

export default OwnerLayout;