import { useState } from "react";

import ProductCard from "./ProductCard";
import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";
import Pagination from "../components/Pagination";
import AnimatedSection from "../components/AnimatedSection";

function ProductSection() {
  return (
    <section
    id="collections"
    className="scroll-mt-32 max-w-7xl mx-auto">

      <div className="ml-8 flex items-center gap-4 mt-20 px-4 md:px-8 lg:px-12">
        <SearchBar />
        <FilterKategori />
        <FilterMerek />
      </div>

      <ProductCard />

      <div className="flex justify-center mt-10">
        <Pagination />
      </div>

    </section>
  );
}

export default ProductSection;