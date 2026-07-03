import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({
  theme = "purple",
  value,
  onChange,
  placeholder = "Search",
}) => {
  const styles = {
    purple: {
      icon: "text-[#5F04E8]",
      border: "border-gray-300",
      text: "text-[#5F04E8]",
      placeholder: "placeholder:text-[#5F04E8]",
      bg: "bg-white",
    },
    orange: {
      icon: "text-white",
      border: "border-orange-50",
      text: "text-white",
      placeholder: "placeholder:text-white",
      bg: "bg-orange-500",
    },
  };

  const color = styles[theme];

  return (
    <div className="group relative">
      <FiSearch
        className={`absolute left-3 top-1/2 -translate-y-1/2
          ${color.icon} transition-all duration-300
          hover:scale-125 cursor-pointer`}
      />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-[140px] sm:w-[180px] group-hover:w-[200px]
          transition-all duration-300 rounded-full
          ${color.border}
          ${color.bg}
          ${color.text}
          ${color.placeholder}
          pl-8 pr-2 py-1
          focus:outline-none font-medium`}
      />
    </div>
  );
};

export default SearchBar;
