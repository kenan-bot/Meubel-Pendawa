import { useState } from "react";
import { useMerek } from "../context/MerekContext";

import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";

const FilterMerek = ({ mode = "owner", onSelect }) => {
  const { merek } = useMerek();

  const [isOpen, setIsOpen] = useState(false);
  const [itemPick, setItemPick] = useState({});

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  const isHome = mode === "home";

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative transition-all duration-200 hover:scale-[1.02]">
        <div
          className={`w-32 py-1 px-2 pr-6 rounded-md cursor-pointer
          transition-all duration-200 hover:shadow-md text-sm font-medium
          ${isHome ? "bg-white text-[#5F04E8]" : "bg-orange-500 text-white"}`}
          onClick={toggleOpen}
        >
          {itemPick.namaMerek || "Pilih Merek"}
        </div>

        <div
          className={`absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer pr-2
            ${isHome ? "text-[#5F04E8]" : "text-white"}`}
        >
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </div>

        {/* drop down */}
        <div
          className={`absolute top-[105%] w-32 z-50 rounded-md shadow-lg
          ${isHome ? "bg-white" : "bg-orange-500"} transition-all duration-700 ease-in-out
          ${isOpen ? "max-h-56 opacity-100" : "max-h-0 opacity-0"} overflow-hidden overflow-y-auto`}
        >
          <div className="flex flex-col">
            <div
              className={`pl-3 p-1.5 py-1 px-1 rounded-t ${
                isHome
                  ? "text-[#5F04E8] bg-purple-100 hover:bg-[#F3EDFF]"
                  : "text-orange-500 bg-orange-50"
              } hover:font-bold hover:scale-[1.02] active:scale-95
                transition-all duration-200 cursor-pointer`}
              onClick={() => {
                setItemPick({});
                onSelect?.(null);
                toggleOpen();
              }}
            >
              Semua
            </div>
            {merek.map((item, index) => (
              <div key={item.idMerek}>
                <div
                  className={`pl-3 p-1.5 py-1 px-1 ${
                    isHome
                      ? "text-[#5F04E8] bg-purple-100 hover:bg-[#F3EDFF]"
                      : "text-orange-500 bg-orange-50"
                  } hover:font-bold hover:scale-[1.02] active:scale-95
                    transition-all duration-200 cursor-pointer
                    ${index === merek.length - 1 ? "rounded-b" : "rounded-none"}`}
                  onClick={() => {
                    setItemPick(item);
                    onSelect?.(item);
                    toggleOpen();
                  }}
                >
                  {item.namaMerek}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMerek;
