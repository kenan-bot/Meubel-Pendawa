import { useState } from "react";

import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

const DropDownFilter = ({
  title = "Pilih",
  items = [],
  value = null,
  onSelect,
  theme = "orange",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isOrange = theme === "orange";
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative transition-all duration-200 hover:scale-[1.02]">
        {/* Button */}
        <div
          onClick={toggleOpen}
          className={`w-32 h-7 px-3 pr-8 rounded-md cursor-pointer text-md font-medium transition-all duration-200 hover:shadow-md
          flex items-center
          ${isOrange ? "bg-orange-500 text-white" : "bg-white text-[#5F04E8]"}`}
        >
          {value?.label || title}
        </div>

        {/* Icon */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer
          ${isOrange ? "text-white" : "text-[#5F04E8]"}`}
        >
          {isOpen ? <FaAngleUp size={15} /> : <FaAngleDown size={15} />}
        </div>

        {/* Dropdown */}
        <div
          className={`absolute top-[105%] w-32 z-50 rounded-md shadow-lg
          transition-all duration-700 ease-in-out overflow-hidden overflow-y-auto
          ${isOrange ? "bg-orange-500" : "bg-white"}
          ${isOpen ? "max-h-56 opacity-100" : "max-h-0 opacity-0"}`}
        >
          {/* Semua */}
          <div
            className={`pl-3 py-2 cursor-pointer transition-all duration-200
              hover:font-bold hover:scale-[1.02]
              ${isOrange ? "bg-orange-50 text-orange-500" : "bg-purple-100 text-[#5F04E8]"}`}
            onClick={() => {
              onSelect({
                value: "__ALL__",
                label: "Semua",
              });
              setIsOpen(false);
            }}
          >
            Semua
          </div>

          {items.map((item, index) => (
            <div
              key={item.value}
              onClick={() => {
                onSelect?.(item);
                setIsOpen(false);
              }}
              className={`pl-3 py-2 text-s cursor-pointer transition-all duration-200
              hover:font-bold hover:scale-[1.02]
              ${
                isOrange
                  ? "bg-orange-50 text-orange-500"
                  : "bg-purple-100 text-[#5F04E8]"
              }
              ${index === items.length - 1 ? "rounded-b" : ""}`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropDownFilter;
