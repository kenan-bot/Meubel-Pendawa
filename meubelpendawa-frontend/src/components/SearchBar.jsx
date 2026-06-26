import React from "react";
import { FiSearch } from "react-icons/fi";
import AnimatedSection from "./AnimatedSection";

const SearchBar = () => {
  return (
    <AnimatedSection>
      <div className="group relative">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F04E8]
          transition-all duration-300 hover:scale-125 cursor-pointer"/>

        <input
          type="text"
          placeholder="search"
          className="w-[140px] sm:w-[180px] group-hover:w-[200px] transition-all duration-300
        rounded-full border border-gray-300 pl-8 pr-2 py-1 focus:outline-none placeholder:text-[#5F04E8] font-semibold text-[#5F04E8]"
        ></input>
      </div>
    </AnimatedSection>
  );
};

export default SearchBar;
