import { useState, useEffect } from "react";

import FormInput from "./FormInput";

import { updateMerek } from "../api/merekApi";
import { useMerek } from "../context/MerekContext";

export default function MerekEditForm({ merek, onSuccess, onError }) {
  const [namaMerek, setNamaMerek] = useState("");
  const [loading, setLoading] = useState(false);

  const { merek: merekList, updateMerekState } = useMerek();

  useEffect(() => {
    if (!merek) return;

    setNamaMerek(merek.namaMerek || "");
  }, [merek]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaMerek.trim()) {
      onError?.("Nama merek wajib diisi");
      return;
    }

    const namaBaru = namaMerek.trim().toLowerCase();

    const sudahAda = merekList.some(
      (item) =>
        item.idMerek !== merek.idMerek &&
        item.namaMerek.trim().toLowerCase() === namaBaru,
    );

    if (sudahAda) {
      onError?.("Merek sudah ada");
      return;
    }

    try {
      setLoading(true);

      const dataUpdate = {
        ...merek,
        namaMerek: namaMerek.trim(),
      };

      const result = await updateMerek(dataUpdate);

      updateMerekState(result);

      onSuccess?.("Merek berhasil diperbarui");
    } catch (error) {
      console.error(error);

      onError?.("Gagal memperbarui merek");
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
