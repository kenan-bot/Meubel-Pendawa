import { useState, useEffect } from "react";

import FormInput from "./FormInput";
import Toast from "./Toast";

import { updateMerek } from "../api/merekApi";
import { useMerek } from "../context/MerekContext";

const MerekEditForm = ({ merek, onClose }) => {
  const [namaMerek, setNamaMerek] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { updateMerekState } = useMerek();

  useEffect(() => {
    if (merek) {
      setNamaMerek(merek.namaMerek || "");
    }
  }, [merek]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

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

      const result = await updateMerek({
        ...merek,
        namaMerek,
      });

      updateMerekState(result);

      setToast({
        type: "success",
        message: "Merek berhasil diperbarui",
      });

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: error.response?.data?.message || "Gagal memperbarui merek",
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
          placeholder="Masukkan nama merek"
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

export default MerekEditForm;
