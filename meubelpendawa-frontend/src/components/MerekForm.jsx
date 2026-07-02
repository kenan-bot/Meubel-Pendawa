import { useState } from "react";

import FormInput from "./FormInput";

import { createMerek } from "../api/merekApi";
import { useMerek } from "../context/MerekContext";

export default function MerekForm({ onSuccess, onError }) {
  const [namaMerek, setNamaMerek] = useState("");
  const [loading, setLoading] = useState(false);

  const { merek, addMerek } = useMerek();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaMerek.trim()) {
      onError?.("Nama merek wajib diisi");
      return;
    }

    const namaBaru = namaMerek.trim().toLowerCase();

    const sudahAda = merek.some(
      (item) => item.namaMerek.trim().toLowerCase() === namaBaru,
    );

    if (sudahAda) {
      onError?.("Merek sudah ada");
      return;
    }

    try {
      setLoading(true);

      const result = await createMerek({
        namaMerek: namaMerek.trim(),
      });

      addMerek(result);

      setNamaMerek("");

      onSuccess?.();
    } catch (error) {
      console.error(error);

      onError?.("Gagal menambah merek");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Nama Merek"
        value={namaMerek}
        onChange={(e) => setNamaMerek(e.target.value)}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`
            px-4 py-2 rounded-md
            text-white
            transition-all duration-200
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 hover:scale-105 active:scale-95"
            }
          `}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
