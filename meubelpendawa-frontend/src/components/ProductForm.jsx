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
import { createProduk, updateProduk } from "../api/productApi";

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const ProductForm = ({ mode = "create", produk = null }) => {
  const [toast, setToast] = useState(null);

  const { kategori } = useKategori();
  const { merek } = useMerek();
  const { produk: produkList, addProduk, updateProdukState } = useProduk();

  const [namaProduk, setNamaProduk] = useState("");
  const [stok, setStok] = useState("");
  const [hargaDefault, setHargaDefault] = useState("");

  const [kategoriId, setKategoriId] = useState("");
  const [merekId, setMerekId] = useState("");

  const [deskripsi, setDeskripsi] = useState("");

  const [gambar, setGambar] = useState(null);
  const [gambarUrl, setGambarUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const normalizeNamaProduk = (nama) =>
    nama.toLowerCase().trim().replace(/\s+/g, " ").split(" ").sort().join(" ");

  useEffect(() => {
    if (mode !== "edit" || !produk) return;

    setNamaProduk(produk.namaProduk || "");
    setStok(String(produk.stok || ""));
    setHargaDefault(String(produk.hargaDefault || ""));
    setDeskripsi(produk.deskripsi || "");

    setKategoriId(produk.kategori?.idKategori || "");
    setMerekId(produk.merek?.idMerek || "");

    setGambarUrl(produk.gambarUrl || "");
    setPreviewUrl("");
  }, [produk, mode]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setToast({
        type: "warning",
        message: "Format gambar harus JPG, PNG, atau WEBP",
      });
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      setToast({
        type: "warning",
        message: "Ukuran gambar maksimal 5 MB",
      });
      return;
    }

    // preview langsung
    setGambar(file);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setUploadingImage(true);

    try {
      const uploadedUrl = await uploadGambar(file);

      setGambarUrl(uploadedUrl);
    } catch (error) {
      setToast({
        type: "error",
        message: "Upload gambar gagal",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "create" && !gambar) {
      setToast({
        type: "warning",
        message: "Gambar produk wajib diisi",
      });
      return;
    }

    if (!namaProduk.trim()) {
      setToast({
        type: "warning",
        message: "Nama produk wajib diisi",
      });
      return;
    }

    if (!kategoriId) {
      setToast({
        type: "warning",
        message: "Kategori wajib dipilih",
      });
      return;
    }

    if (!merekId) {
      setToast({
        type: "warning",
        message: "Merek wajib dipilih",
      });
      return;
    }

    // VALIDASI DUPLIKAT NAMA PRODUK
    const namaBaru = normalizeNamaProduk(namaProduk);

    const sudahAda = produkList.some((item) => {
      const namaExisting =
        item.namaProdukNormalized ?? normalizeNamaProduk(item.namaProduk);

      if (mode === "edit") {
        return (
          item.idProduk !== produk?.idProduk &&
          namaExisting === namaBaru &&
          item.merek?.idMerek === merekId
        );
      }

      return namaExisting === namaBaru && item.merek?.idMerek === merekId;
    });

    if (sudahAda) {
      setToast({
        type: "warning",
        message: "Nama produk sudah ada",
      });
      return;
    }

    setLoading(true);

    try {
      const data = {
        namaProduk: namaProduk.trim(),
        stok: Number(stok || 0),
        hargaDefault: Number(hargaDefault || 0),
        deskripsi,
        gambarUrl,

        kategori: {
          idKategori: kategoriId,
        },

        merek: {
          idMerek: merekId,
        },
      };

      if (mode === "create") {
        const produkBaru = await createProduk(data);

        addProduk(produkBaru);

        setToast({
          type: "success",
          message: "Produk berhasil ditambahkan",
        });

        setNamaProduk("");
        setStok("");
        setHargaDefault("");
        setKategoriId("");
        setMerekId("");
        setDeskripsi("");
        setGambar(null);
        setGambarUrl("");
        setPreviewUrl("");
      } else {
        const dataUpdate = {
          ...data,
          idProduk: produk.idProduk,
        };

        const result = await updateProduk(dataUpdate);

        updateProdukState(result);

        setToast({
          type: "success",
          message: "Produk berhasil diperbarui",
        });
      }
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: error.response?.data?.message || "Gagal menyimpan produk",
      });
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
                {previewUrl || gambarUrl ? (
                  <img
                    src={previewUrl || gambarUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Preview Gambar</span>
                )}
              </div>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="mt-2 text-sm w-full"
                onChange={handleImageChange}
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
                disabled={loading || uploadingImage}
                className={`
                px-5 py-2 rounded-md text-white
                transition-all duration-200
                ${
                  loading || uploadingImage
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 hover:scale-105 active:scale-95"
                }`}
              >
                {uploadingImage
                  ? "Mengunggah gambar..."
                  : loading
                    ? "Menyimpan..."
                    : mode === "edit"
                      ? "Update"
                      : "Simpan"}
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
