import { createContext, useContext, useEffect, useState } from "react";
import { getAllKaryawan } from "../api/karyawanApi";

const KaryawanContext = createContext();

export const KaryawanProvider = ({ children }) => {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKaryawan();
  }, []);

  const addKaryawan = (newKaryawan) => {
    setKaryawan((prev) => [newKaryawan, ...prev]);
  };

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

  const filteredKaryawan = karyawan
    .filter((item) => {
      if (!item.statusAktif && item.tanggalNonaktif) {
        const waktuNonaktif = new Date(item.tanggalNonaktif);
        const sekarang = new Date();

        const selisihJam = (sekarang - waktuNonaktif) / (1000 * 60 * 60);

        if (selisihJam >= 24) {
          return false;
        }
      }

      return true;
    })
    .filter((item) => {
      const keyword = searchTerm.toLowerCase();

      return (
        item.namaKaryawan?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.username?.toLowerCase().includes(keyword)
      );
    });

  const updateStatusState = (karyawanUpdate) => {
    setKaryawan((prev) =>
      prev.map((item) =>
        item.idKaryawan === karyawanUpdate.idKaryawan ? karyawanUpdate : item,
      ),
    );
  };

  return (
    <KaryawanContext.Provider
      value={{
        karyawan,
        filteredKaryawan,
        loading,
        searchTerm,
        setSearchTerm,
        reloadKaryawan: loadKaryawan,
        addKaryawan,
        updateStatusState,
      }}
    >
      {children}
    </KaryawanContext.Provider>
  );
};

export const useKaryawan = () => {
  return useContext(KaryawanContext);
};
