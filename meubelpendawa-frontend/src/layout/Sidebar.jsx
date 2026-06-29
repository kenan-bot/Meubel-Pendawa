import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { MdMenuOpen } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";

export default function Sidebar({ menus }) {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const namaKaryawan = localStorage.getItem("namaKaryawan");
  const handleLogout = async () => {
    try {
      const idKaryawan = localStorage.getItem("idKaryawan");
      await axios.post(`http://localhost:8080/auth/logout/${idKaryawan}`);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("idKaryawan");
      localStorage.removeItem("namaKaryawan");

      navigate("/login");
    }
  };

  return (
    <>
      <nav
        className={`shadow-md h-screen p-2 flex flex-col duration-500 bg-orange-500 
          text-white ${open ? "w-40 sm:w-48 md:w-60" : "w-14 sm:w-16"}`}
      >
        {/* Header */}
        <div className="px-2 md:px-3 py-2 h-16 md:h-20 flex justify-between items-center">
          <img
            src={logo}
            alt="Logo"
            className={`${open ? "w-8 md:w-10" : "w-0"} rounded-md`}
          />
          <div>
            <MdMenuOpen
              size={34}
              className={`hover:bg-orange-700 rounded-md duration-500 cursor-pointer ${!open && " rotate-180"}`}
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>

        {/* Body */}
        <ul className="flex-1">
          {menus.map((item, index) => {
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({
                  isActive,
                }) => `${isActive ? "bg-orange-700" : "hover:bg-orange-700"} 
              rounded-md duration-300 block`}
              >
                <li className="px-2 md:px-3 py-2 my-2 cursor-pointer flex gap-2 items-center relative group">
                  <div>{item.icon}</div>

                  <p
                    className={`${!open && "w-0 translate-x-24"} duration-500 overflow-hidden text-xs sm:text-sm md:text-base`}
                  >
                    {" "}
                    {item.label}{" "}
                  </p>

                  <p
                    className={`${open && "hidden"} absolute left-32 shadow-md rounded-md w-0 p-0 
                text-black bg-white duration-100 overflow-hidden group-hover:w-fit
                group-hover:p-2 group-hover:left-16`}
                  >
                    {" "}
                    {item.label}{" "}
                  </p>
                </li>
              </NavLink>
            );
          })}
        </ul>

        {/* footer */}
        <div className="flex items-center gap-2 px-3 py-2 overflow-hidden">
          <div>
            <FaUserCircle className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div
            className={`leading-5 ${!open && "w-0 translate-x-24"} duration-500 overflow-hidden font-bold`}
          >
            <p className="text-xs sm:text-sm md:text-base">{namaKaryawan}</p>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="mt-1 text-[10px] sm:text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md duration-300 flex items-center gap-1"
            >
              <RiLogoutCircleLine size={14} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* confirm blur */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-black">
            <h2 className="text-lg font-bold mb-2">Konfirmasi Logout</h2>

            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Batal
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Konfrimasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
