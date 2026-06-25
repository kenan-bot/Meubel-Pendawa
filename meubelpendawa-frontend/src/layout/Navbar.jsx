import React, { useState } from "react";
import FormLogin from "../login/FormLogin";
import kursi from "../assets/LOGO_KURSI_MeubelPendawa.svg";

function Navbar() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const menuClass = (menu) =>
    `cursor-pointer transition pb-1 ${
      activeMenu === menu
        ? "text-[#5F04E8] font-bold text-xl md:text-2xl border-b-2 border-purple-700"
        : "text-gray-700 font-medium text-base md:text-lg hover:text-[#5F04E8]"
    }`;

  return (
    <> 
      <nav className="w-full bg-white shadow-[0_5px_5px_rgba(0,0,0,0.25)] fixed top-0 left-0 z-50 h-20 md:h-24 flex items-center">
        {/* CONTAINER */}
        <div className="w-full flex items-center justify-between px-3 sm:px-4 md:px-6 h-full">
          {/* LEFT - LOGO */}
          <div className="flex items-center gap-1 md:gap-2 overflow-hidden">
            <img
              src={kursi}
              alt="kursi"
              className="h-12 md:h-16 lg:h-18 w-auto object-contain"
            />
            <h1
              className="ml-[-25px] text-[#5F04E8] font-extrabold
                text-[24px] md:text-[24px] lg:text-[30px] leading-none"
            >
              Toko Meubel Pendawa
            </h1>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 ml-auto pr-2 lg:pr-4">
            <ul className="flex items-center gap-6 lg:gap-8">
              <li
                onClick={() => setActiveMenu("Home")}
                className={menuClass("Home")}
              >
                Home
              </li>

              <li
                onClick={() => setActiveMenu("Collections")}
                className={menuClass("Collections")}
              >
                Collections
              </li>

              <li
                onClick={() => setActiveMenu("Contact")}
                className={menuClass("Contact")}
              >
                Contact
              </li>
            </ul>

            {/* BUTTON PORTAL - DESKTOP */}
            <button
              onClick={() => setShowLogin(true)}
              className="transition-all duration-500 ease-in-out hover:scale-105 bg-[#5F04E8] hover:bg-purple-800 text-white px-4 md:px-5 py-2 rounded-lg transition shadow-md text-sm md:text-base"
            >
              Portal Management
            </button>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="hover:scale-125 transition-all duration-300 md:hidden text-2xl text-[#5F04E8]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`absolute top-20 left-0 w-full bg-white shadow-lg md:hidden
          origin-top transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          
          ${
            mobileOpen
              ? "opacity-100 scale-y-100 translate-y-0"
              : "opacity-0 scale-y-0 -translate-y-3 pointer-events-none"
            }`}
        
        >

          <ul className="flex flex-col gap-4 p-5">
            <li
              onClick={() => {
                setActiveMenu("Home");
                setMobileOpen(false);
              }}
              className={menuClass("Home")}
            >
              Home
            </li>

            <li
              onClick={() => {
                setActiveMenu("Collections");
                setMobileOpen(false);
              }}
              className={menuClass("Collections")}
            >
              Collections
            </li>

            <li
              onClick={() => {
                setActiveMenu("Contact");
                setMobileOpen(false);
              }}
              className={menuClass("Contact")}
            >
              Contact
            </li>

            {/* BUTTON PORTAL - MOBILE */}
            <button
              onClick={() => {
                setShowLogin(true);
                setMobileOpen(false);
              }}
              className="transition-all duration-500 ease-in-out hover:scale-105 bg-[#5F04E8]
            hover:bg-purple-800 text-white px-4 py-2 rounded-lg mt-3 w-full"
            >
              Portal Management
            </button>
          </ul>
        </div>
      </nav>

      {/* FORM LOGIN OVERLAY */}
      {showLogin && (
        <div className="fixed inset-0 z-[100]">
          <FormLogin onClose={() => setShowLogin(false)} />
        </div>
      )}
    </>
  );
}

export default Navbar;
