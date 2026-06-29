import { createContext, useContext, useEffect, useState } from "react";
import { getAllKategori } from "../api/kategoriApi";

const KategoriContext = createContext();

export const KategoriProvider = ({ children }) => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadKategori();
  }, []);

  return (
    <KategoriContext.Provider
      value={{
        kategori,
        loading,
      }}
    >
      {children}
    </KategoriContext.Provider>
  );
};

// Custom Hook
export const useKategori = () => {
  return useContext(KategoriContext);
};