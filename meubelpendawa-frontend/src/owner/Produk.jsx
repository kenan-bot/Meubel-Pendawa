import ProductCard from "../components/ProductCard";
import { useProduk } from "../context/ProdukContext";
import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";
import usePagination from "../hooks/usePagination";
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import DropDownFilter from "../components/DropDownFilter";

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
    nonaktifProduk,
    aktifProduk,
    setSelectedStatus,
    selectedStok,
    setSelectedStok,
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
    return (
      <div className="flex justify-center items-center h-72">
        Memuat produk...
      </div>
    );
  }

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleConfirmToggleStatus = async () => {
    if (!produkToToggle) return;

    try {
      if (produkToToggle.statusAktif) {
        await nonaktifProduk(produkToToggle.idProduk);

        showToast("success", "Produk berhasil dinonaktifkan");
      } else {
        await aktifProduk(produkToToggle.idProduk);

        showToast("success", "Produk berhasil diaktifkan");
      }
    } catch (error) {
      console.error(error);

      showToast("error", "Gagal mengubah status produk");
    } finally {
      setOpenConfirmProduk(false);
      setProdukToToggle(null);
    }
  };

  const statusOptions = [
    {
      value: true,
      label: "Aktif",
    },
    {
      value: false,
      label: "Nonaktif",
    },
  ];

  const stokItems = [
    {
      value: "TERSEDIA",
      label: "Tersedia",
    },
    {
      value: "HABIS",
      label: "Habis",
    },
  ];

  return (
    <>
      <div className="px-3 py-5 md:p-5">
        {/* Header */}
        <div className="md:-mt-7 mb-6">
          <h1 className="font-extrabold text-2xl md:text-3xl leading-tight">
            Manajemen Produk
          </h1>

          <p className="text-sm md:text-base text-gray-500">
            Kelola dengan mudah semua data produk
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
          <SearchBar
            theme="orange"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <FilterKategori
              onSelect={(item) => setSelectedKategori(item?.idKategori ?? null)}
            />

            <FilterMerek
              onSelect={(item) => setSelectedMerek(item?.idMerek ?? null)}
            />

            <DropDownFilter
              title="Status"
              items={statusOptions}
              theme="orange"
              onSelect={(item) =>
                setSelectedStatus(item.value === "__ALL__" ? null : item.value)
              }
            />

            <DropDownFilter
              title="Stok"
              items={stokItems}
              value={
                selectedStok
                  ? {
                      value: selectedStok,
                      label: selectedStok === "TERSEDIA" ? "Tersedia" : "Habis",
                    }
                  : null
              }
              onSelect={(item) =>
                setSelectedStok(item.value === "__ALL__" ? null : item.value)
              }
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedProduk(null);
              setOpenTambahProduk(true);
            }}
            className="md:ml-auto flex items-center gap-1.5 bg-orange-500 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300"
          >
            <FiPlus size={18} />
            Tambah Produk
          </button>
        </div>

        {/* Card */}
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

      {/* Modal Tambah */}
      <Modal
        maxWidth="max-w-3xl"
        isOpen={openTambahProduk}
        title="Tambah Produk"
        onClose={() => {
          setOpenTambahProduk(false);
          setSelectedProduk(null);
        }}
      >
        <ProductForm
          mode="create"
          onSuccess={() => {
            setOpenTambahProduk(false);
            setSelectedProduk(null);
          }}
        />
      </Modal>

      {/* Modal Edit */}
      <Modal
        maxWidth="max-w-3xl"
        isOpen={openUpdateProduk}
        title="Update Produk"
        onClose={() => {
          setOpenUpdateProduk(false);
          setSelectedProduk(null);
        }}
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

      {/* Confirm Toggle */}
      <ConfirmModal
        isOpen={openConfirmProduk}
        title={
          produkToToggle?.statusAktif ? "Nonaktifkan Produk" : "Aktifkan Produk"
        }
        message={
          produkToToggle
            ? produkToToggle.statusAktif
              ? `Produk "${produkToToggle.namaProduk}" akan dinonaktifkan dan tidak dapat digunakan dalam transaksi.`
              : `Produk "${produkToToggle.namaProduk}" akan diaktifkan kembali dan dapat digunakan dalam transaksi.`
            : ""
        }
        confirmText={produkToToggle?.statusAktif ? "Nonaktifkan" : "Aktifkan"}
        cancelText="Batal"
        onConfirm={handleConfirmToggleStatus}
        onClose={() => {
          setOpenConfirmProduk(false);
          setProdukToToggle(null);
        }}
      />

      {toast && <Toast type={toast.type} message={toast.message} />}
    </>
  );
}
