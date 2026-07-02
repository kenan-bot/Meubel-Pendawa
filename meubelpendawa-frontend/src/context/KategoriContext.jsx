import { createContext, useContext, useEffect, useState } from "react";
import { getAllKategori } from "../api/kategoriApi";

const KategoriContext = createContext();

export const KategoriProvider = ({ children }) => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKategori();
  }, []);

  const loadKategori = async () => {
    try {
      const data = await getAllKategori();
      setKategori(data);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    } finally {
      setLoading(false);
    }
  };

  const addKategori = (kategoriBaru) => {
    setKategori((prev) => [...prev, kategoriBaru]);
  };

  const updateKategoriState = (kategoriUpdate) => {
    setKategori((prev) =>
      prev.map((item) =>
        item.idKategori === kategoriUpdate.idKategori ? kategoriUpdate : item,
      ),
    );
  };

  return (
    <KategoriContext.Provider
      value={{
        kategori,
        loading,
        reloadKategori: loadKategori,
        addKategori,
        updateKategoriState,
      }}
    >
      {children}
    </KategoriContext.Provider>
  );
};

export const useKategori = () => {
  return useContext(KategoriContext);
};
