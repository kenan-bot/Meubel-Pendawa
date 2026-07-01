import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

import { useKaryawan } from "../context/KaryawanContext";
import SearchBar from "../components/SearchBar";
import KaryawanCard from "../components/KaryawanCard";
import { FiPlus } from "react-icons/fi";
import KaryawanForm from "../components/KaryawanForm";
import Modal from "../components/Modal";

function Karyawan() {
  const [openModal, setOpenModal] = useState(false);
  const { filteredKaryawan, loading, searchTerm, setSearchTerm } =
    useKaryawan();

  return (
    <div className="px-3 py-5 md:p-5">
      {/* Judul */}
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl leading-tight">
          Kelola Karyawan
        </h1>

        <p className="text-sm md:text-base text-gray-500">
          Kelola karyawan dan akses sistem karyawan
        </p>
      </div>

      {/* Search + Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <SearchBar
          theme="orange"
          placeholder="Cari karyawan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={() => setOpenModal(true)}
          className="md:ml-auto flex items-center gap-1.5 bg-orange-500 text-white text-sm font-medium
          px-3 py-1.5 rounded-md hover:bg-orange-600 hover:scale-[1.02]
          transition-all duration-300 ease-out"
        >
          <FiPlus size={18} />
          Tambah Karyawan
        </button>
      </div>

      {/* Header */}
      <div
        className="hidden lg:grid grid-cols-[230px_170px_315px_160px_105px_80px] items-center
        border border-orange-500 text-orange-500 rounded-2xl px-5 py-4 font-semibold mb-4"
      >
        <div>Nama Karyawan</div>
        <div>Role</div>
        <div>Email</div>
        <div>Username</div>
        <div>Status</div>
        <div className="text-center">Tindakan</div>
      </div>

      {/* Card */}
      {loading ? (
        <div className="p-6">Memuat data karyawan...</div>
      ) : (
        <KaryawanCard karyawan={filteredKaryawan} />
      )}

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Tambah Karyawan"
      >
        <KaryawanForm />
      </Modal>
    </div>
  );
}

export default Karyawan;
