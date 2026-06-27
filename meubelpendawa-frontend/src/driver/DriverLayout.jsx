import Sidebar from "../../layout/Sidebar";
import { driverMenus } from "../../role-menu/SidebarMenu";
import { Outlet } from "react-router-dom";

function DriverLayout(){

    return(

        <div className="flex">

            <Sidebar menus={driverMenus}/>

            <div className="flex-1">

                <Outlet/>

            </div>

        </div>

    )

}