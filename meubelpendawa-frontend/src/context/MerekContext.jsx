import { createContext, useContext, useEffect, useState } from "react";
import { getAllMerek } from "../api/merekApi";

const MerekContext = createContext();

export const MerekProvider = ({ children }) => {
  const [merek, setMerek] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadMerek();
  }, []);

  return (
    <MerekContext.Provider
      value={{
        merek,
        loading,
      }}
    >
      {children}
    </MerekContext.Provider>
  );
};

export const useMerek = () => {
  return useContext(MerekContext);
};