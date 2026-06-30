import { useState } from "react";
import { useProduk } from "../context/ProdukContext";

import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";
import Pagination from "../components/Pagination";

function ProductSection() {

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;

  const {
    filteredProduk,
    loading,

    searchTerm,
    setSearchTerm,

    setSelectedKategori,
    setSelectedMerek,

  } = useProduk();

  return (
    <section
      id="collections"
      className="scroll-mt-32 max-w-7xl mx-auto"
    >

      <div className="ml-8 flex items-center gap-4 mt-20 px-4 md:px-8 lg:px-12">

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          theme="purple"
        />

        <FilterKategori
          mode="home"
          onSelect={(item) => setSelectedKategori(item ? item.idKategori : null)}
        />

        <FilterMerek
          mode="home" onSelect={(item) => setSelectedMerek(item ? item.idMerek : null)}
        />

      </div>

      {loading ? (
        <div className="text-center py-10 text-white">
          Memuat produk...
        </div>
      ) : (
        <ProductCard
          produk={filteredProduk}
          mode="home"
        />
      )}

      <div className="flex justify-center mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) =>
            setCurrentPage(page)
          }
        />
      </div>

    </section>
  );
}

export default ProductSection;