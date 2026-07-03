import { useLoginLog } from "../context/LoginLogContext";
import SearchBar from "../components/SearchBar";
import LoginLogCard from "../components/LoginLogCard";
import DateRangePicker from "../components/DateRangePicker";
import { useState } from "react";
import DropDownFilter from "../components/DropDownFilter";
import usePagination from "../hooks/usePagination";
import Pagination from "../components/Pagination";

const statusOptions = [
  { value: "Aktif", label: "Aktif" },
  { value: "Logout", label: "Logout" },
];

const jamKerjaOptions = [
  { value: false, label: "Jam Kerja" },
  { value: true, label: "Diluar Jam Kerja" },
];

function RiwayatLogin() {
  const {
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
  } = useLoginLog();

  const {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredLoginLogs, 5);

  return (
    <div className="px-3 py-5 md:p-5">
      {/* Judul */}
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl">Riwayat Login</h1>

        <p className="text-sm md:text-base text-gray-500">
          Monitoring aktivitas login seluruh pengguna
        </p>
      </div>

      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        {/* KIRI */}
        <div className="flex flex-wrap items-center gap-3 w-full">
          <SearchBar
            theme="orange"
            placeholder="Cari nama karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <DropDownFilter
            title="Status"
            items={statusOptions}
            value={statusFilter}
            onSelect={setStatusFilter}
          />

          <DropDownFilter
            title="Jam Kerja"
            items={jamKerjaOptions}
            value={jamKerjaFilter}
            onSelect={setJamKerjaFilter}
          />
        </div>

        {/* KANAN */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onReset={() => {
            setStartDate("");
            setEndDate("");
          }}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Memuat data...</div>
      ) : (
        <>
          {/* Header Desktop */}
          <div
            className="hidden lg:grid grid-cols-[2fr_1fr_1.6fr_1.6fr_1.2fr_1.4fr_1fr] items-center
            border border-orange-500 text-orange-500 rounded-2xl px-8 py-4 font-semibold mb-4"
          >
            <div className="-ml-4">Nama Karyawan</div>
            <div className="justify-self-start -ml-6">Role</div>
            <div className="pl-6">Login</div>
            <div className="pl-10">Logout</div>
            <div className="pl-14">Durasi</div>
            <div className="justify-self-center pl-12">Jam Kerja</div>
            <div className="justify-self-end">Status</div>
          </div>

          {/* Card */}
          <LoginLogCard loginLogs={paginatedData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={nextPage}
            onPrev={prevPage}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
}

export default RiwayatLogin;
