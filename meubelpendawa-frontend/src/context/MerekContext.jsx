import { createContext, useContext, useEffect, useState } from "react";
import { getAllMerek } from "../api/merekApi";

const MerekContext = createContext();

export const MerekProvider = ({ children }) => {
  const [merek, setMerek] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMerek();
  }, []);

  const loadMerek = async () => {
    try {
      const data = await getAllMerek();
      setMerek(data);
    } catch (error) {
      console.error("Gagal mengambil merek:", error);
    } finally {
      setLoading(false);
    }
  };

  const addMerek = (merekBaru) => {
    setMerek((prev) => [...prev, merekBaru]);
  };

  const updateMerekState = (merekUpdate) => {
    setMerek((prev) =>
      prev.map((item) =>
        item.idMerek === merekUpdate.idMerek ? merekUpdate : item,
      ),
    );
  };

  return (
    <MerekContext.Provider
      value={{
        merek,
        loading,
        reloadMerek: loadMerek,
        addMerek,
        updateMerekState,
      }}
    >
      {children}
    </MerekContext.Provider>
  );
};

export const useMerek = () => {
  return useContext(MerekContext);
};
