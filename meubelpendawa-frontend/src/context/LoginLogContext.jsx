import { createContext, useContext, useEffect, useState } from "react";
import { getAllLoginLog } from "../api/loginLogApi";

const LoginLogContext = createContext();

export const LoginLogProvider = ({ children }) => {
  const [loginLogs, setLoginLogs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Filter tanggal
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLoginLog = async () => {
    try {
      setLoading(true);

      const data = await getAllLoginLog();

      setLoginLogs(data);
    } catch (error) {
      console.error("Gagal mengambil data login log", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter nama + tanggal
  const filteredLoginLogs = loginLogs.filter((item) => {
    const cocokNama = item.namaKaryawan
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const tanggalLogin = item.loginAt.substring(0, 10);

    const cocokTanggal =
      (!startDate || tanggalLogin >= startDate) &&
      (!endDate || tanggalLogin <= endDate);

    return cocokNama && cocokTanggal;
  });

  useEffect(() => {
    fetchLoginLog();
  }, []);

  return (
    <LoginLogContext.Provider
      value={{
        loginLogs,
        filteredLoginLogs,

        loading,

        searchTerm,
        setSearchTerm,

        startDate,
        setStartDate,

        endDate,
        setEndDate,

        fetchLoginLog,
      }}
    >
      {children}
    </LoginLogContext.Provider>
  );
};

export const useLoginLog = () => useContext(LoginLogContext);
