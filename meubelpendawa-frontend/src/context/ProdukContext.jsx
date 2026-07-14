import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllProduk,
  nonaktifkanProduk,
  aktifkanProduk,
} from "../api/productApi";

const ProdukContext = createContext();

export function ProdukProvider({ children }) {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduk();
  }, []);

  //load produk keseluruhan
  const loadProduk = async () => {
    setLoading(true);
    try {
      const data = await getAllProduk();
      setProduk(data);
    } catch (error) {
      console.error("Gagal mengambil produk", error);
    } finally {
      setLoading(false);
    }
  };

  //load produk yg diupdate aja
  const updateProdukState = (produkUpdate) => {
    setProduk((prev) =>
      prev.map((item) =>
        item.idProduk === produkUpdate.idProduk ? produkUpdate : item,
      ),
    );
  };

  const nonaktifProduk = async (idProduk) => {
    const produkUpdate = await nonaktifkanProduk(idProduk);

    updateProdukState(produkUpdate);

    return produkUpdate;
  };

  const aktifProduk = async (idProduk) => {
    const produkUpdate = await aktifkanProduk(idProduk);

    updateProdukState(produkUpdate);

    return produkUpdate;
  };

  const addProduk = (newProduk) => {
    setProduk((prev) => [newProduk, ...prev]);
  };

  const [selectedKategori, setSelectedKategori] = useState(null);
  const [selectedMerek, setSelectedMerek] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedStok, setSelectedStok] = useState(null);

  const filteredProduk = produk.filter((item) => {
    const kategoriMatch =
      !selectedKategori || item.kategori?.idKategori === selectedKategori;

    const merekMatch = !selectedMerek || item.merek?.idMerek === selectedMerek;

    const statusMatch =
      selectedStatus === null || item.statusAktif === selectedStatus;

    const searchMatch =
      !searchTerm ||
      item.namaProduk?.toLowerCase().includes(searchTerm.toLowerCase());

    const stokMatch =
      selectedStok === null ||
      (selectedStok === "TERSEDIA" && item.stok > 0) ||
      (selectedStok === "HABIS" && item.stok === 0);

    return (
      kategoriMatch && merekMatch && statusMatch && stokMatch && searchMatch
    );
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

        nonaktifProduk,
        aktifProduk,

        selectedStatus,
        setSelectedStatus,

        selectedStok,
        setSelectedStok,
      }}
    >
      {children}
    </ProdukContext.Provider>
  );
}

export function useProduk() {
  return useContext(ProdukContext);
}
