import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";

import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

import AtributCard from "../components/AtributCard";

import KategoriForm from "../components/KategoriForm";
import MerekForm from "../components/MerekForm";

import KategoriEditForm from "../components/KategoriEditForm";
import MerekEditForm from "../components/MerekEditForm";

import { useKategori } from "../context/KategoriContext";
import { useMerek } from "../context/MerekContext";

import { isKategoriUsed } from "../api/kategoriApi";

import { isMerekUsed } from "../api/merekApi";

export default function AtributProduk() {
  const { kategori, loading: kategoriLoading } = useKategori();

  const { merek, loading: merekLoading } = useMerek();

  const [openTambahKategori, setOpenTambahKategori] = useState(false);

  const [toast, setToast] = useState(null);

  const [openTambahMerek, setOpenTambahMerek] = useState(false);

  const [openEditKategori, setOpenEditKategori] = useState(false);

  const [openEditMerek, setOpenEditMerek] = useState(false);

  const [openKategoriConfirm, setOpenKategoriConfirm] = useState(false);

  const [openMerekConfirm, setOpenMerekConfirm] = useState(false);

  const [selectedKategori, setSelectedKategori] = useState(null);

  const [selectedMerek, setSelectedMerek] = useState(null);

  const [keywordKategori, setKeywordKategori] = useState("");

  const [keywordMerek, setKeywordMerek] = useState("");

  const kategoriTersaring = kategori.filter((item) =>
    item.namaKategori.toLowerCase().includes(keywordKategori.toLowerCase()),
  );

  const merekTersaring = merek.filter((item) =>
    item.namaMerek.toLowerCase().includes(keywordMerek.toLowerCase()),
  );

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleKategoriClick = async (kategoriItem) => {
    try {
      const result = await isKategoriUsed(kategoriItem.idKategori);

      if (result.used) {
        setSelectedKategori(kategoriItem);

        setOpenKategoriConfirm(true);

        return;
      }

      setSelectedKategori(kategoriItem);

      setOpenEditKategori(true);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: "Gagal memeriksa kategori",
      });
    }
  };

  const handleMerekClick = async (merekItem) => {
    try {
      const result = await isMerekUsed(merekItem.idMerek);

      if (result.used) {
        setSelectedMerek(merekItem);

        setOpenMerekConfirm(true);

        return;
      }

      setSelectedMerek(merekItem);

      setOpenEditMerek(true);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: "Gagal memeriksa merek",
      });
    }
  };

  return (
    <>
      <div className="px-3 py-5 md:p-5">
        {/* Header */}
        <div className="md:-mt-7 mb-6">
          <h1 className="font-extrabold text-2xl md:text-3xl leading-tight">
            Atribut Produk
          </h1>

          <p className="text-sm md:text-base text-gray-500">
            Kelola kategori dan merek produk
          </p>
        </div>

        {/* grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* kategori */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Kategori</h2>

              <button
                onClick={() => setOpenTambahKategori(true)}
                className="
                  flex items-center gap-1.5
                  bg-orange-500
                  text-white
                  text-sm
                  font-medium
                  px-3 py-1.5
                  rounded-md
                  hover:bg-orange-600 hover:scale-[1.02]
                  transition-all duration-300 ease-out
                "
              >
                <FiPlus size={18} />
                Tambah Kategori
              </button>
            </div>

            <div className="mb-4">
              <SearchBar
                value={keywordKategori}
                onChange={(e) => setKeywordKategori(e.target.value)}
                placeholder="Cari kategori..."
                theme="purple"
              />
            </div>

            <div className="space-y-3">
              {kategoriLoading ? (
                <div>Memuat kategori...</div>
              ) : (
                kategoriTersaring.map((item) => (
                  <AtributCard
                    key={item.idKategori}
                    nama={item.namaKategori}
                    onClick={() => handleKategoriClick(item)}
                  />
                ))
              )}
            </div>
          </div>

          {/* merek */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Merek</h2>

              <button
                onClick={() => setOpenTambahMerek(true)}
                className="
                  flex items-center gap-1.5
                  bg-orange-500
                  text-white
                  text-sm
                  font-medium
                  px-3 py-1.5
                  rounded-md
                  hover:bg-orange-600 hover:scale-[1.02]
                  transition-all duration-300 ease-out
                "
              >
                <FiPlus size={18} />
                Tambah Merek
              </button>
            </div>

            <div className="mb-4">
              <SearchBar
                value={keywordMerek}
                onChange={(e) => setKeywordMerek(e.target.value)}
                placeholder="Cari merek..."
                theme="purple"
              />
            </div>

            <div className="space-y-3">
              {merekLoading ? (
                <div>Memuat merek...</div>
              ) : (
                merekTersaring.map((item) => (
                  <AtributCard
                    key={item.idMerek}
                    nama={item.namaMerek}
                    onClick={() => handleMerekClick(item)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* tambah kategori */}
      <Modal
        isOpen={openTambahKategori}
        onClose={() => setOpenTambahKategori(false)}
        title="Tambah Kategori"
      >
        <KategoriForm
          onSuccess={() => {
            setOpenTambahKategori(false);

            setToast({
              type: "success",
              message: "Kategori berhasil ditambahkan",
            });
          }}
          onError={(message) =>
            setToast({
              type: "error",
              message,
            })
          }
        />
      </Modal>

      {/* tambah merek */}
      <Modal
        isOpen={openTambahMerek}
        onClose={() => setOpenTambahMerek(false)}
        title="Tambah Merek"
      >
        <MerekForm
          onSuccess={() => {
            setOpenTambahMerek(false);

            setToast({
              type: "success",
              message: "Merek berhasil ditambahkan",
            });
          }}
          onError={(message) =>
            setToast({
              type: "error",
              message,
            })
          }
        />
      </Modal>

      {/* edit kategori */}
      <Modal
        isOpen={openEditKategori}
        onClose={() => {
          setOpenEditKategori(false);
          setSelectedKategori(null);
        }}
        title="Edit Kategori"
      >
        <KategoriEditForm
          kategori={selectedKategori}
          onSuccess={(message) => {
            setToast({
              type: "success",
              message,
            });

            setOpenEditKategori(false);
            setSelectedKategori(null);
          }}
          onError={(message) => {
            setToast({
              type: "error",
              message,
            });
          }}
        />
      </Modal>

      {/* edit merek */}
      <Modal
        isOpen={openEditMerek}
        onClose={() => {
          setOpenEditMerek(false);
          setSelectedMerek(null);
        }}
        title="Edit Merek"
      >
        <MerekEditForm
          merek={selectedMerek}
          onSuccess={(message) => {
            setToast({
              type: "success",
              message,
            });

            setOpenEditMerek(false);
            setSelectedMerek(null);
          }}
          onError={(message) => {
            setToast({
              type: "error",
              message,
            });
          }}
        />
      </Modal>

      {/* Cconfirm kategori */}
      <ConfirmModal
        isOpen={openKategoriConfirm}
        title="Kategori sedang digunakan"
        message="Kategori ini sedang digunakan oleh produk. Jika nama kategori diubah,
        semua produk yang menggunakan kategori ini akan ikut berubah. Yakin ingin melanjutkan?"
        confirmText="Lanjutkan"
        cancelText="Batal"
        onConfirm={() => {
          setOpenKategoriConfirm(false);
          setOpenEditKategori(true);
        }}
        onClose={() => {
          setOpenKategoriConfirm(false);
          setSelectedKategori(null);
        }}
      />

      {/* confirm merek */}
      <ConfirmModal
        isOpen={openMerekConfirm}
        title="Merek sedang digunakan"
        message="Merek ini sedang digunakan oleh produk. Jika nama kategori diubah,
        semua produk yang menggunakan kategori ini akan ikut berubah. Yakin ingin melanjutkan?"
        confirmText="Lanjutkan"
        cancelText="Batal"
        onConfirm={() => {
          setOpenMerekConfirm(false);
          setOpenEditMerek(true);
        }}
        onClose={() => {
          setOpenMerekConfirm(false);
          setSelectedMerek(null);
        }}
      />
      {toast && <Toast type={toast.type} message={toast.message} />}
    </>
  );
}
