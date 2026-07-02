import { useState, useEffect } from "react";

import FormInput from "./FormInput";
import Toast from "./Toast";

import { updateMerek } from "../api/merekApi";
import { useMerek } from "../context/MerekContext";

export default function MerekEditForm({ merek, onSuccess }) {
  const [namaMerek, setNamaMerek] = useState("");

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const { updateMerekState } = useMerek();

  useEffect(() => {
    if (!merek) return;

    setNamaMerek(merek.namaMerek || "");
  }, [merek]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaMerek.trim()) {
      setToast({
        type: "warning",
        message: "Nama merek wajib diisi",
      });
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

      setToast({
        type: "success",
        message: "Merek berhasil diperbarui",
      });

      setTimeout(() => {
        onSuccess?.();
      }, 800);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: "Gagal memperbarui merek",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
    </>
  );
}
