import { useState, useEffect } from "react";
import axios from "axios";

import ProductCard from "./ProductCard";
import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";
import Pagination from "../components/Pagination";
import AnimatedSection from "../components/AnimatedSection";

function ProductSection() {
  // ✅ TAMBAHAN BARU - state untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduk();
  }, []);

  const loadProduk = async () => {
    try {
      const response = await axios.get("http://localhost:8080/produk");

      setProduk(response.data);
    } catch (error) {
      console.error("Gagal mengambil produk", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="collections" className="scroll-mt-32 max-w-7xl mx-auto">
      <div className="ml-8 flex items-center gap-4 mt-20 px-4 md:px-8 lg:px-12">
        <SearchBar />
        <FilterKategori />
        <FilterMerek />
      </div>

      {loading ? (
        <div className="text-center py-10">Memuat produk...</div>
      ) : (
        <ProductCard produk={produk} />
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
