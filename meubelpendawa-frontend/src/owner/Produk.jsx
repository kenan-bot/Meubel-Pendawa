import ProductCard from "../components/ProductCard";
import { useProduk } from "../context/ProdukContext";
import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";

export default function Produk() {
  const { filteredProduk, loading } = useProduk();

  const handleEdit = (item) => {
    console.log("Edit:", item);
  };

  const handleDelete = (idProduk) => {
    console.log("Hapus:", idProduk);
  };

  if (loading) {
    return <div className="p-6">Memuat produk...</div>;
  }

  return (
    <div className="px-3 py-5 md:p-5">
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl leading-tight">
          Manajemen Produk
        </h1>

        <p className="text-sm md:text-base text-gray-500 mt-0">
          Kelola dengan mudah semua data produk
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
        <SearchBar theme="orange" />

        <div className="flex items-center gap-2">
          <FilterKategori />
          <FilterMerek />
        </div>
      </div>

      <div className="mt-3">
        <ProductCard
          produk={filteredProduk}
          mode="owner"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
