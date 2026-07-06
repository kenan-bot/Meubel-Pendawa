import { createContext, useContext, useEffect, useState } from "react";

import {
  getAllPengiriman,
  updateStatusPengiriman,
} from "../api/pengirimanApi";

const PengirimanContext = createContext();

export const PengirimanProvider = ({ children }) => {
  const [pengiriman, setPengiriman] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPengiriman();

    const interval = setInterval(() => {
      loadPengiriman();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadPengiriman = async () => {
    try {
      const data = await getAllPengiriman();
      setPengiriman(data);
    } catch (error) {
      console.error(
        "Gagal mengambil data pengiriman",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatusState = (
    idPengiriman,
    statusPengiriman
  ) => {
    setPengiriman((prev) =>
      prev.map((item) =>
        item.idPengiriman === idPengiriman
          ? {
              ...item,
              statusPengiriman,
            }
          : item
      )
    );
  };

  const completePengiriman = async (
    idPengiriman
  ) => {
    const updated =
      await updateStatusPengiriman(
        idPengiriman,
        "COMPLETED"
      );

    updateStatusState(
      idPengiriman,
      "COMPLETED"
    );

    return updated;
  };

  return (
    <PengirimanContext.Provider
      value={{
        pengiriman,
        loading,
        reloadPengiriman: loadPengiriman,
        completePengiriman,
        updateStatusState,
      }}
    >
      {children}
    </PengirimanContext.Provider>
  );
};

export const usePengiriman = () => {
  return useContext(PengirimanContext);
};