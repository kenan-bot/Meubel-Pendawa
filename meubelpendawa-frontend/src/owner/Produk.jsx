import ProductCard from "../components/ProductCard";
import { useProduk } from "../context/ProdukContext";

export default function Produk() {
  const { produk, loading } = useProduk();

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
    <div className="p-6">
      <ProductCard
        produk={produk}
        mode="owner"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}