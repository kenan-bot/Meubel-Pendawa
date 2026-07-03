import { useProduk } from "../context/ProdukContext";

import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";
import usePagination from "../hooks/usePagination";
import Pagination from "../components/Pagination";

function ProductSection() {
  const {
    filteredProduk,
    loading,
    searchTerm,
    setSearchTerm,
    setSelectedKategori,
    setSelectedMerek,
  } = useProduk();

  const {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredProduk, 12);

  const scrollToCollections = () => {
    document.getElementById("collections")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePageChange = (page) => {
    goToPage(page);

    requestAnimationFrame(() => {
      scrollToCollections();
    });
  };

  const handleNext = () => {
    nextPage();

    requestAnimationFrame(() => {
      scrollToCollections();
    });
  };

  const handlePrev = () => {
    prevPage();

    requestAnimationFrame(() => {
      scrollToCollections();
    });
  };

  return (
    <section id="collections" className="scroll-mt-32 max-w-7xl mx-auto">
      {/* Filter Area */}
      <div className="mt-20 px-4 md:px-8 lg:px-12">
        {/* Mobile */}
        <div className="flex flex-col gap-3 ml-6 md:ml-0 md:hidden">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            theme="purple"
          />

          <div className="flex w-full items-center justify-start gap-3">
            <FilterKategori
              mode="home"
              onSelect={(item) =>
                setSelectedKategori(item ? item.idKategori : null)
              }
            />

            <FilterMerek
              mode="home"
              onSelect={(item) => setSelectedMerek(item ? item.idMerek : null)}
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex ml-8 items-center gap-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            theme="purple"
          />

          <FilterKategori
            mode="home"
            onSelect={(item) =>
              setSelectedKategori(item ? item.idKategori : null)
            }
          />

          <FilterMerek
            mode="home"
            onSelect={(item) => setSelectedMerek(item ? item.idMerek : null)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-white">Memuat produk...</div>
      ) : (
        <>
          <ProductCard produk={paginatedData} mode="home" />

          <div className="flex justify-center mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        </>
      )}
    </section>
  );
}

export default ProductSection;
