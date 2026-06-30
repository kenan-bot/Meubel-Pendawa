import { createContext, useContext, useEffect, useState } from "react";
import { getAllProduk } from "../api/productApi";

const ProdukContext = createContext();

export function ProdukProvider({ children }) {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("LOAD PRODUK");
    loadProduk();
  }, []);

  //load produk yg diupdate aja
  const updateProdukState = (produkUpdate) => {
    setProduk((prev) =>
      prev.map((item) =>
        item.idProduk === produkUpdate.idProduk ? produkUpdate : item,
      ),
    );
  };

  //load produk keseluruhan
  const loadProduk = async () => {
    try {
      const data = await getAllProduk();
      setProduk(data);
    } catch (error) {
      console.error("Gagal mengambil produk", error);
    } finally {
      setLoading(false);
    }
  };

  const addProduk = (newProduk) => {
    setProduk((prev) => [newProduk, ...prev]);
  };

  const [selectedKategori, setSelectedKategori] = useState(null);
  const [selectedMerek, setSelectedMerek] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProduk = produk.filter((item) => {
    const kategoriMatch =
      !selectedKategori || item.kategori?.idKategori === selectedKategori;
    const merekMatch = !selectedMerek || item.merek?.idMerek === selectedMerek;
    const searchMatch =
      !searchTerm ||
      item.namaProduk?.toLowerCase().includes(searchTerm.toLowerCase());

    return kategoriMatch && merekMatch && searchMatch;
  });

  return (
    <ProdukContext.Provider
      value={{
        produk,
        filteredProduk,
        loading,

        selectedKategori,
        setSelectedKategori,

        selectedMerek,
        setSelectedMerek,

        searchTerm,
        setSearchTerm,

        reloadProduk: loadProduk,
        addProduk,
        updateProdukState,
      }}
    >
      {children}
    </ProdukContext.Provider>
  );
}

export function useProduk() {
  return useContext(ProdukContext);
}
