import { useState, useEffect } from "react";

import FormInput from "./FormInput";
import Toast from "./Toast";

import { updateKategori } from "../api/kategoriApi";
import { useKategori } from "../context/KategoriContext";

const KategoriEditForm = ({ kategori, onClose }) => {
  const [namaKategori, setNamaKategori] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { updateKategoriState } = useKategori();

  useEffect(() => {
    if (kategori) {
      setNamaKategori(kategori.namaKategori || "");
    }
  }, [kategori]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaKategori.trim()) {
      setToast({
        type: "warning",
        message: "Nama kategori wajib diisi",
      });

      return;
    }

    try {
      setLoading(true);

      const result = await updateKategori({
        ...kategori,
        namaKategori,
      });

      updateKategoriState(result);

      setToast({
        type: "success",
        message: "Kategori berhasil diperbarui",
      });

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: error.response?.data?.message || "Gagal memperbarui kategori",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Nama Kategori"
          value={namaKategori}
          onChange={(e) => setNamaKategori(e.target.value)}
          placeholder="Masukkan nama kategori"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`
              px-5 py-2 rounded-md text-white
              transition-all duration-200
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 hover:scale-105 active:scale-95"
              }
            `}
          >
            {loading ? "Menyimpan..." : "Update"}
          </button>
        </div>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </>
  );
};

export default KategoriEditForm;
