import { useState, useEffect } from "react";

import FormInput from "./FormInput";

import { updateKategori } from "../api/kategoriApi";
import { useKategori } from "../context/KategoriContext";

export default function KategoriEditForm({ kategori, onSuccess, onError }) {
  const [namaKategori, setNamaKategori] = useState("");
  const [loading, setLoading] = useState(false);

  const { kategori: kategoriList, updateKategoriState } = useKategori();

  useEffect(() => {
    if (!kategori) return;

    setNamaKategori(kategori.namaKategori || "");
  }, [kategori]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaKategori.trim()) {
      onError?.("Nama kategori wajib diisi");
      return;
    }

    const namaBaru = namaKategori.trim().toLowerCase();

    const sudahAda = kategoriList.some(
      (item) =>
        item.idKategori !== kategori.idKategori &&
        item.namaKategori.trim().toLowerCase() === namaBaru,
    );

    if (sudahAda) {
      onError?.("Kategori sudah ada");
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

      onSuccess?.("Kategori berhasil diperbarui");
    } catch (error) {
      console.error(error);

      onError?.("Gagal memperbarui kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
