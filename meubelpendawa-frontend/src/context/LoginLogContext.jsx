import { createContext, useContext, useEffect, useState } from "react";
import { getAllLoginLog } from "../api/loginLogApi";

const LoginLogContext = createContext();

export const LoginLogProvider = ({ children }) => {
  const [loginLogs, setLoginLogs] = useState([]);
  const [filteredLoginLogs, setFilteredLoginLogs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchLoginLog = async () => {
    try {
      setLoading(true);

      const data = await getAllLoginLog();

      setLoginLogs(data);
      setFilteredLoginLogs(data);
    } catch (error) {
      console.error("Gagal mengambil data login log", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginLog();
  }, []);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();

    const hasil = loginLogs.filter((item) =>
      item.namaKaryawan.toLowerCase().includes(keyword)
    );

    setFilteredLoginLogs(hasil);
  }, [searchTerm, loginLogs]);

  return (
    <LoginLogContext.Provider
      value={{
        loginLogs,
        filteredLoginLogs,
        loading,
        searchTerm,
        setSearchTerm,
        fetchLoginLog,
      }}
    >
      {children}
    </LoginLogContext.Provider>
  );
};

export const useLoginLog = () => useContext(LoginLogContext);