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

  return (
    <ProdukContext.Provider
      value={{
        produk,
        loading,
        reloadProduk: loadProduk,
      }}
    >
      {children}
    </ProdukContext.Provider>
  );
}

export function useProduk() {
  return useContext(ProdukContext);
}