import { createContext, useContext, useEffect, useState } from "react";
import { getAllLoginLog } from "../api/loginLogApi";

const LoginLogContext = createContext();

export const LoginLogProvider = ({ children }) => {
  const [loginLogs, setLoginLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Filter tanggal
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter status
  const [statusFilter, setStatusFilter] = useState(null);

  // Filter jam kerja
  const [jamKerjaFilter, setJamKerjaFilter] = useState(null);

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

  const filteredLoginLogs = loginLogs.filter((item) => {
    // Search
    const cocokNama = item.namaKaryawan
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    //Tanggal
    const tanggalLogin = item.loginAt.substring(0, 10);

    const cocokTanggal =
      (!startDate || tanggalLogin >= startDate) &&
      (!endDate || tanggalLogin <= endDate);

    // Status
    const cocokStatus =
      !statusFilter ||
      statusFilter.value === "__ALL__" ||
      item.status === statusFilter.value;

    // Jam Kerja
    const cocokJamKerja =
      !jamKerjaFilter ||
      jamKerjaFilter.value === "__ALL__" ||
      item.loginDiluarJamOperasional === jamKerjaFilter.value;

    return cocokNama && cocokTanggal && cocokStatus && cocokJamKerja;
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

        statusFilter,
        setStatusFilter,

        jamKerjaFilter,
        setJamKerjaFilter,

        fetchLoginLog,
      }}
    >
      {children}
    </LoginLogContext.Provider>
  );
};

export const useLoginLog = () => useContext(LoginLogContext);
