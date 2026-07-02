import { useLoginLog } from "../context/LoginLogContext";
import SearchBar from "../components/SearchBar";
import LoginLogCard from "../components/LoginLogCard";

function RiwayatLogin() {
  const { filteredLoginLogs, loading, searchTerm, setSearchTerm } =
    useLoginLog();

  return (
    <div className="px-3 py-5 md:p-5">
      {/* Judul */}
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl">Riwayat Login</h1>

        <p className="text-sm md:text-base text-gray-500">
          Monitoring aktivitas login seluruh pengguna
        </p>
      </div>

      {/* Search */}
      <div className="mb-5">
        <SearchBar
          theme="orange"
          placeholder="Cari nama karyawan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Memuat data...</div>
      ) : (
        <>
          {/* Header Desktop */}
          <div
            className="hidden lg:grid grid-cols-[240px_120px_190px_190px_170px_120px] items-center
            border border-orange-500 text-orange-500 rounded-2xl px-5 py-4 font-semibold mb-4"
          >
            <div>Nama Karyawan</div>
            <div>Role</div>
            <div>Login</div>
            <div>Logout</div>
            <div>Durasi</div>
            <div>Status</div>
          </div>

          {/* Card */}
          <LoginLogCard loginLogs={filteredLoginLogs} />

          {/* Pagination nanti di sini */}
        </>
      )}
    </div>
  );
}

export default RiwayatLogin;
