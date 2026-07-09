import ProductCard from "../components/ProductCard";
import { useProduk } from "../context/ProdukContext";
import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";
import usePagination from "../hooks/usePagination";
import Pagination from "../components/Pagination";
import { nonaktifkanProduk } from "../api/productApi";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import { nonaktifkanProduk, aktifkanProduk } from "../api/productApi";

import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import { useState } from "react";

import { FiPlus } from "react-icons/fi";

export default function Produk() {
  const [openUpdateProduk, setOpenUpdateProduk] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [openTambahProduk, setOpenTambahProduk] = useState(false);
  const [openConfirmProduk, setOpenConfirmProduk] = useState(false);
  const [toast, setToast] = useState(null);
  const [produkToToggle, setProdukToToggle] = useState(null);
  const {
    filteredProduk,
    loading,
    searchTerm,
    setSearchTerm,
    setSelectedKategori,
    setSelectedMerek,
    reloadProduk,
  } = useProduk();

  const handleEdit = (item) => {
    setSelectedProduk(item);
    setOpenUpdateProduk(true);
  };

  const handleToggleStatus = (produk) => {
    setProdukToToggle(produk);
    setOpenConfirmProduk(true);
  };

  const {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredProduk, 12);

  if (loading) {
    return <div className="p-6">Memuat produk...</div>;
  }

  const handleConfirmNonaktif = async () => {
    try {
      if (produkToToggle.statusAktif) {
        await nonaktifkanProduk(produkToToggle.idProduk);
      } else {
        await aktifkanProduk(produkToToggle.idProduk);
      }

      await reloadProduk();

      setToast({
        type: "success",
        message: produkToToggle.statusAktif
          ? "Produk berhasil dinonaktifkan"
          : "Produk berhasil diaktifkan",
      });

      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({
        type: "error",
        message: "Gagal mengubah status produk",
      });

      setTimeout(() => setToast(null), 3000);
    } finally {
      setOpenConfirmProduk(false);
      setProdukToToggle(null);
    }
  };

  return (
    <>
      <div className="px-3 py-5 md:p-5">
        <div className="md:-mt-7 mb-6">
          <h1 className="font-extrabold text-2xl md:text-3xl leading-tight">
            Manajemen Produk
          </h1>

          <p className="text-sm md:text-base text-gray-500 mt-0">
            Kelola dengan mudah semua data produk
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
          <SearchBar
            theme="orange"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <FilterKategori
              onSelect={(item) =>
                setSelectedKategori(item ? item.idKategori : null)
              }
            />
            <FilterMerek
              onSelect={(item) => setSelectedMerek(item ? item.idMerek : null)}
            />
          </div>

          {/* tambah produk */}
          <button
            onClick={() => setOpenTambahProduk(true)}
            className="md:ml-auto flex items-center gap-1.5 bg-orange-500 text-white text-sm font-medium
            px-3 py-1.5 rounded-md hover:bg-orange-600 hover:scale-[1.02]
            transition-all duration-300 ease-out"
          >
            <FiPlus size={18} />
            Tambah Produk
          </button>
        </div>

        <div className="mt-3">
          <ProductCard
            produk={paginatedData}
            mode="owner"
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </div>
      </div>

      <Modal
        maxWidth="max-w-3xl"
        isOpen={openTambahProduk}
        onClose={() => setOpenTambahProduk(false)}
        title="Tambah Produk"
      >
        <ProductForm />
      </Modal>

      <Modal
        maxWidth="max-w-3xl"
        isOpen={openUpdateProduk}
        onClose={() => {
          setOpenUpdateProduk(false);
          setSelectedProduk(null);
        }}
        title="Update Produk"
      >
        <ProductForm
          mode="edit"
          produk={selectedProduk}
          onSuccess={() => {
            setOpenUpdateProduk(false);
            setSelectedProduk(null);
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={openConfirmProduk}
        title={
          produkToToggle?.statusAktif ? "Nonaktifkan Produk" : "Aktifkan Produk"
        }
        message={
          produkToToggle?.statusAktif
            ? "Yakin ingin menonaktifkan produk ini? Produk tidak dapat digunakan untuk transaksi."
            : "Yakin ingin mengaktifkan produk ini? Produk dapat digunakan kembali untuk transaksi."
        }
        confirmText={produkToToggle?.statusAktif ? "Nonaktifkan" : "Aktifkan"}
        cancelText="Batal"
        onConfirm={handleConfirmNonaktif}
        onClose={() => {
          setOpenConfirmProduk(false);
          setProdukToToggle(null);
        }}
      />
      {toast && <Toast type={toast.type} message={toast.message} />}
    </>
  );
}
