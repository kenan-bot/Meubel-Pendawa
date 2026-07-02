import { useState, useEffect } from "react";

import FormInput from "./FormInput";

import { createKategori } from "../api/kategoriApi";
import { useKategori } from "../context/KategoriContext";

export default function KategoriForm({ onSuccess, onError }) {
  const [namaKategori, setNamaKategori] = useState("");
  const [loading, setLoading] = useState(false);
  const { kategori, addKategori } = useKategori();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaKategori.trim()) {
      onError?.("Nama kategori wajib diisi");
      return;
    }

    const namaBaru = namaKategori.trim().toLowerCase();

    const sudahAda = kategori.some(
      (item) => item.namaKategori.trim().toLowerCase() === namaBaru,
    );

    if (sudahAda) {
      onError?.("Kategori sudah ada");
      return;
    }

    try {
      setLoading(true);

      const result = await createKategori({
        namaKategori: namaKategori.trim(),
      });

      setNamaKategori("");
      addKategori(result);

      onSuccess?.();
    } catch (error) {
      onError?.("Gagal menambah kategori");
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
            className={`px-4 py-2 rounded-md text-white transition-all duration-200
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 hover:scale-105 active:scale-95"
                }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </>
  );
}
