import Sidebar from "../layout/Sidebar";
import { kasirMenus } from "../role-menu/SidebarMenu";
import { Outlet } from "react-router-dom";

function KasirLayout(){

    return(

        <div className="flex">
            <Sidebar menus={kasirMenus}/>

            <div className="flex-1 p-8">
                <Outlet/>
            </div>
        </div>
    )

}

export default KasirLayout;