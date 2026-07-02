import { useState, useEffect } from "react";

import FormInput from "./FormInput";
import Toast from "./Toast";

import { updateKategori } from "../api/kategoriApi";
import { useKategori } from "../context/KategoriContext";

export default function KategoriEditForm({ kategori, onError }) {
  const [namaKategori, setNamaKategori] = useState("");

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const { updateKategoriState } = useKategori();

  useEffect(() => {
    if (!kategori) return;

    setNamaKategori(kategori.namaKategori || "");
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

      const dataUpdate = {
        ...kategori,
        namaKategori: namaKategori.trim(),
      };

      const result = await updateKategori(dataUpdate);

      updateKategoriState(result);

      setToast({
        type: "success",
        message: "Kategori berhasil diperbarui",
      });

      setTimeout(() => {
        onSuccess?.();
      }, 800);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: "Gagal memperbarui kategori",
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
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`
              px-4 py-2
              rounded-md
              text-white
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

    </>
  );
}
