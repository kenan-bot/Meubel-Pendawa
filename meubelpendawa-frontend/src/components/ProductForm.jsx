import { useState } from "react";
import { useEffect } from "react";

import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import RupiahInput from "./RupiahInput";
import Toast from "./Toast";

import { useKategori } from "../context/KategoriContext";
import { useMerek } from "../context/MerekContext";
import { useProduk } from "../context/ProdukContext";

import { uploadGambar } from "../api/uploadApi";
import { createProduk } from "../api/productApi";

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const ProductForm = ({ onSuccess }) => {
  const [toast, setToast] = useState(null);

  const { kategori } = useKategori();
  const { merek } = useMerek();
  const { reloadProduk } = useProduk();

  const [namaProduk, setNamaProduk] = useState("");
  const [stok, setStok] = useState("");
  const [hargaDefault, setHargaDefault] = useState("");

  const [kategoriId, setKategoriId] = useState("");
  const [merekId, setMerekId] = useState("");

  const [deskripsi, setDeskripsi] = useState("");

  const [gambar, setGambar] = useState(null);
  const [gambarUrl, setGambarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let finalGambarUrl = gambarUrl;

      if (gambar) {
        finalGambarUrl = await uploadGambar(gambar);
      }

      if (!gambar) {
        setToast({ type: "warning", message: "Gambar produk wajib diisi" });
        return;
      }

      if (!namaProduk.trim()) {
        setToast({ type: "warning", message: "Nama produk wajib diisi" });
        return;
      }

      if (!kategoriId) {
        setToast({ type: "warning", message: "Kategori wajib dipilih" });
        return;
      }

      if (!merekId) {
        setToast({ type: "warning", message: "Merek wajib dipilih" });
        return;
      }

      const data = {
        namaProduk,
        stok: Number(stok),
        hargaDefault: Number(hargaDefault),
        deskripsi,
        gambarUrl: finalGambarUrl,

        kategori: {
          idKategori: kategoriId,
        },

        merek: {
          idMerek: merekId,
        },
      };

      await createProduk(data);
      await reloadProduk();

      setNamaProduk("");
      setStok("");
      setHargaDefault("");
      setKategoriId("");
      setMerekId("");
      setDeskripsi("");
      setGambar(null);
      setGambarUrl("");

      setToast({
        type: "success",
        message: "Produk berhasil ditambahkan",
      });

      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: "Gagal menambahkan produk" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-[220px_1fr] gap-6">
          {/* KOLOM KIRI */}
          <div className="space-y-4">
            {/* Preview Gambar */}
            <div className="w-full">
              <div
                className="w-full h-52 border-2 border-dashed border-gray-300
              rounded-xl flex items-center justify-center overflow-hidden"
              >
                {gambar ? (
                  <img
                    src={URL.createObjectURL(gambar)}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Preview Gambar</span>
                )}
              </div>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.svg"
                className="mt-2 text-sm w-full"
                onChange={(e) => setGambar(e.target.files[0])}
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Deskripsi
              </label>

              <textarea
                rows={5}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Masukkan deskripsi produk"
                className="w-full border border-gray-300 rounded-md px-3 py-2
              resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="space-y-4">
            <FormInput
              label="Nama Produk"
              value={namaProduk}
              onChange={(e) => setNamaProduk(e.target.value)}
              placeholder="Masukkan nama produk"
            />

            <div className="relative">
              <FormInput
                label="Stok"
                type="text"
                inputMode="numeric"
                value={stok === "" ? "0" : Number(stok).toLocaleString("id-ID")}
                onChange={(e) => {
                  const angka = e.target.value.replace(/\D/g, "");
                  setStok(angka);
                }}
              />

              <div className="absolute right-3 top-[38px] flex flex-col">
                <button
                  type="button"
                  onClick={() => setStok(String(Number(stok || 0) + 1))}
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                >
                  <FaChevronUp size={10} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStok(String(Math.max(0, Number(stok || 0) - 1)))
                  }
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                >
                  <FaChevronDown size={10} />
                </button>
              </div>
            </div>

            <RupiahInput
              label="Harga"
              value={hargaDefault}
              onChange={(val) => {
                console.log("Harga:", val);
                setHargaDefault(val);
              }}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormSelect
                label="Kategori"
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
              >
                {kategori.map((item) => (
                  <option key={item.idKategori} value={item.idKategori}>
                    {item.namaKategori}
                  </option>
                ))}
              </FormSelect>

              <FormSelect
                label="Merek"
                value={merekId}
                onChange={(e) => setMerekId(e.target.value)}
              >
                {merek.map((item) => (
                  <option key={item.idMerek} value={item.idMerek}>
                    {item.namaMerek}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 text-white px-5 py-2 rounded-md
              hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all duration-20"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </form>
      {toast && <Toast type={toast.type} message={toast.message} />}
    </>
  );
};

export default ProductForm;
