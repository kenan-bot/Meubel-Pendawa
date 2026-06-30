import { createContext, useContext, useEffect, useState } from "react";
import { getAllKaryawan } from "../api/karyawanApi";

const KaryawanContext = createContext();

export const KaryawanProvider = ({ children }) => {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKaryawan();
  }, []);

  const loadKaryawan = async () => {
    try {
      const data = await getAllKaryawan();
      setKaryawan(data);
    } catch (error) {
      console.error("Gagal mengambil data karyawan", error);
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredKaryawan = karyawan.filter((item) =>
    item.namaKaryawan
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <KaryawanContext.Provider
      value={{
        karyawan,
        filteredKaryawan,
        loading,
        searchTerm,
        setSearchTerm,
        reloadKaryawan: loadKaryawan,
      }}
    >
      {children}
    </KaryawanContext.Provider>
  );
};

export const useKaryawan = () => {
  return useContext(KaryawanContext);
};