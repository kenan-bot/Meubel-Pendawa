import { useState } from "react";
import { useProduk } from "../context/ProdukContext";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";
import Pagination from "../components/Pagination";

function ProductSection() {
  // ✅ TAMBAHAN BARU - state untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;
  const { produk, loading } = useProduk();



  return (
    <section id="collections" className="scroll-mt-32 max-w-7xl mx-auto">
      <div className="ml-8 flex items-center gap-4 mt-20 px-4 md:px-8 lg:px-12">
        <SearchBar />
        <FilterKategori  mode="home"/>
        <FilterMerek />
      </div>

      {loading ? (
        <div className="text-center py-10 text-white">Memuat produk...</div>
      ) : (
        <ProductCard produk={produk} mode="home" />
      )}

      {/* ✅ BAGIAN INI DIUBAH - Pagination sekarang pakai props */}
      <div className="flex justify-center mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </section>
  );
}

export default ProductSection;
