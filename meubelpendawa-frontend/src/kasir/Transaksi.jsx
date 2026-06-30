import { useMemo, useState, useEffect } from "react";
import { useProduk } from "../context/ProdukContext";
import { createTransaksi, prosesPembayaran } from "../api/transaksiApi";
import { createDetailTransaksi } from "../api/detailTransaksiApi";
import { getAllKaryawan } from "../api/karyawanApi";

import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";

import { GiShoppingBag } from "react-icons/gi";
import { FaTrash, FaQrcode } from "react-icons/fa";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

function formatTanggal(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${dd} - ${mm} - ${yyyy} : ${hh}:${mi}:${ss}`;
}

// format ala "Selasa, 30 Juni 2026 • Pukul 18.37.04"
function formatTanggalHeader(date) {
  const hari = date.toLocaleDateString("id-ID", { weekday: "long" });
  const tanggal = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const jam = date
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/:/g, ".");
  return `${hari}, ${tanggal} • Pukul ${jam}`;
}

function Transaksi() {
  const { produk, loading } = useProduk();

  // ----- form pemesan -----
  const [namaPemesan, setNamaPemesan] = useState("");
  const [noWhatsapp, setNoWhatsapp] = useState("");
  const [alamatPengiriman, setAlamatPengiriman] = useState("");
  const [metodePengiriman, setMetodePengiriman] = useState("DELIVERY");
  const [metodePembayaran, setMetodePembayaran] = useState("CASH"); // CASH | CASHLESS
  const [driverId, setDriverId] = useState("");
  const [driverList, setDriverList] = useState([]);

  const isDelivery = metodePengiriman === "DELIVERY";
  const isCashless = metodePembayaran === "CASHLESS";

  // ----- jam realtime untuk header kanan atas -----
  const [jamSekarang, setJamSekarang] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setJamSekarang(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadDriver = async () => {
      try {
        const data = await getAllKaryawan();
        setDriverList(data.filter((k) => k.role?.toUpperCase() === "DRIVER"));
      } catch (error) {
        console.error("Gagal mengambil daftar driver:", error);
      }
    };
    loadDriver();
  }, []);

  // kalau ganti ke Pickup, bersihkan alamat & driver yang sudah keisi
  useEffect(() => {
    if (!isDelivery) {
      setAlamatPengiriman("");
      setDriverId("");
    }
  }, [isDelivery]);

  // ----- filter produk -----
  const [keyword, setKeyword] = useState("");
  const [kategoriPick, setKategoriPick] = useState(null);
  const [merekPick, setMerekPick] = useState(null);

  const produkTersaring = useMemo(() => {
    return produk.filter((item) => {
      const cocokKeyword = item.namaProduk
        ?.toLowerCase()
        .includes(keyword.toLowerCase());
      const cocokKategori = kategoriPick
        ? item.kategori?.idKategori === kategoriPick.idKategori
        : true;
      const cocokMerek = merekPick
        ? item.merek?.idMerek === merekPick.idMerek
        : true;
      return cocokKeyword && cocokKategori && cocokMerek;
    });
  }, [produk, keyword, kategoriPick, merekPick]);

  // ----- keranjang (lokal dulu, baru dikirim ke backend saat proses pesanan) -----
  const [keranjang, setKeranjang] = useState([]); // { produk, qty, hargaJual }
  const [orderId] = useState(`#${Date.now().toString().slice(-7)}`);
  const [waktu] = useState(new Date());
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [editHargaId, setEditHargaId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pesan, setPesan] = useState("");

  const tambahKeKeranjang = (item) => {
    setKeranjang((prev) => {
      const sudahAda = prev.find((c) => c.produk.idProduk === item.idProduk);
      if (sudahAda) {
        return prev.map((c) =>
          c.produk.idProduk === item.idProduk ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { produk: item, qty: 1, hargaJual: item.hargaDefault }];
    });
  };

  const ubahQty = (idProduk, delta) => {
    setKeranjang((prev) =>
      prev
        .map((c) =>
          c.produk.idProduk === idProduk
            ? { ...c, qty: Math.max(1, c.qty + delta) }
            : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const hapusItem = (idProduk) => {
    setKeranjang((prev) => prev.filter((c) => c.produk.idProduk !== idProduk));
  };

  const ubahHarga = (idProduk, harga) => {
    setKeranjang((prev) =>
      prev.map((c) =>
        c.produk.idProduk === idProduk ? { ...c, hargaJual: Number(harga) || 0 } : c
      )
    );
  };

  const totalPesanan = keranjang.reduce(
    (sum, c) => sum + c.qty * c.hargaJual,
    0
  );
  const kembalian = jumlahBayar ? Number(jumlahBayar) - totalPesanan : 0;

  const resetForm = () => {
    setNamaPemesan("");
    setNoWhatsapp("");
    setAlamatPengiriman("");
    setDriverId("");
    setKeranjang([]);
    setJumlahBayar("");
  };

  const handleProsesPesanan = async () => {
    setPesan("");

    if (!namaPemesan || !noWhatsapp) {
      setPesan("Nama dan No. Telp/WhatsApp wajib diisi.");
      return;
    }
    if (isDelivery && (!alamatPengiriman || !driverId)) {
      setPesan("Alamat & driver wajib diisi untuk pengiriman Delivery.");
      return;
    }
    if (keranjang.length === 0) {
      setPesan("Keranjang masih kosong.");
      return;
    }
    if (!jumlahBayar || Number(jumlahBayar) < totalPesanan) {
      setPesan("Jumlah bayar belum mencukupi total pesanan.");
      return;
    }

    try {
      setSubmitting(true);

      const transaksiBaru = await createTransaksi({
        namaPemesan,
        noWhatsapp,
        alamatPengiriman: isDelivery ? alamatPengiriman : "-",
        metodePengiriman,
        metodePembayaran,
        driver: isDelivery ? { idKaryawan: driverId } : null,
      });

      for (const item of keranjang) {
        await createDetailTransaksi({
          qty: item.qty,
          hargaJual: item.hargaJual,
          produk: { idProduk: item.produk.idProduk },
          transaksi: { orderId: transaksiBaru.orderId },
        });
      }

      await prosesPembayaran(transaksiBaru.orderId, Number(jumlahBayar));

      setPesan(`Pesanan ${transaksiBaru.orderId} berhasil diproses.`);
      resetForm();
    } catch (error) {
      console.error(error);
      setPesan(
        error?.response?.data?.message ||
          "Gagal memproses pesanan. Coba periksa kembali data."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 -m-8 p-4 bg-gray-50 h-[calc(100vh-2rem)] overflow-hidden text-sm">
      {/* ===== KIRI : FORM PEMESAN (di tengah/atas) + PRODUK ===== */}
      <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-sm flex flex-col min-h-0">
        {/* header form (TIDAK ikut scroll), tetap di tengah seperti semula tapi dikecilkan */}
        <div className="p-4 lg:p-5 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-gray-800">Form Pemesan</h1>
              <p className="text-xs text-gray-400 mt-0.5">Halaman Form Pemesan</p>
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {formatTanggalHeader(jamSekarang)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Nama</label>
              <input
                type="text"
                value={namaPemesan}
                onChange={(e) => setNamaPemesan(e.target.value)}
                placeholder="Nama Pemesan"
                className="w-full mt-1 px-2.5 py-1.5 text-sm rounded-md border border-gray-300 bg-white placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">No. Telp/WhatsApp</label>
              <input
                type="text"
                value={noWhatsapp}
                onChange={(e) => setNoWhatsapp(e.target.value)}
                placeholder="085XXXXXXXXX"
                className="w-full mt-1 px-2.5 py-1.5 text-sm rounded-md border border-gray-300 bg-white placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Pengiriman</label>
              <select
                value={metodePengiriman}
                onChange={(e) => setMetodePengiriman(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 text-sm rounded-md bg-orange-500 text-white font-semibold focus:outline-none"
              >
                <option value="DELIVERY">Delivery</option>
                <option value="PICKUP">Pickup</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Pembayaran</label>
              <select
                value={metodePembayaran}
                onChange={(e) => setMetodePembayaran(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 text-sm rounded-md bg-orange-500 text-white font-semibold focus:outline-none"
              >
                <option value="CASH">Cash</option>
                <option value="CASHLESS">Cashless</option>
              </select>
            </div>
          </div>

          {/* alamat & driver HANYA muncul kalau Delivery */}
          {isDelivery && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Alamat Lengkap</label>
                <input
                  type="text"
                  value={alamatPengiriman}
                  onChange={(e) => setAlamatPengiriman(e.target.value)}
                  placeholder="Jl. Pendawa No. 3, Lodoyong, Kec. Ambarawa"
                  className="w-full mt-1 px-2.5 py-1.5 text-sm rounded-md border border-gray-300 bg-white placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Driver</label>
                <select
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-800 font-semibold focus:outline-none focus:border-orange-500"
                >
                  <option value="">Pilih Driver</option>
                  {driverList.map((d) => (
                    <option key={d.idKaryawan} value={d.idKaryawan}>
                      {d.namaKaryawan}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* search & filter -- z-index tinggi biar dropdown gak ketutup produk */}
          <div className="relative z-30 flex flex-wrap items-center gap-2 mb-3">
            <SearchBar
              theme="orange"
              placeholder="Search furniture..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <FilterKategori onSelect={setKategoriPick} />
            <FilterMerek onSelect={setMerekPick} />
          </div>
        </div>

        {/* grid produk -- INI yang discroll, dikecilin supaya lebih banyak kelihatan */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 lg:px-5 pb-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat produk...</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {produkTersaring.map((item) => (
                <div
                  key={item.idProduk}
                  className="bg-white rounded-lg overflow-hidden text-[#5F04E8] relative shadow-sm border border-gray-100"
                >
                  <button
                    onClick={() => tambahKeKeranjang(item)}
                    className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold hover:scale-110 transition"
                    title="Tambah ke keranjang"
                  >
                    +
                  </button>

                  <div className="h-20 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {item.gambarUrl ? (
                      <img
                        src={item.gambarUrl}
                        alt={item.namaProduk}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">Tidak ada gambar</span>
                    )}
                  </div>

                  <div className="p-2">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {item.merek && (
                        <span className="inline-block px-1.5 py-0.5 border border-[#5F04E8] text-[#5F04E8] text-[9px] font-semibold rounded-full">
                          {item.merek.namaMerek}
                        </span>
                      )}
                      {item.kategori && (
                        <span className="inline-block px-1.5 py-0.5 border border-orange-500 text-orange-500 text-[9px] font-semibold rounded-full">
                          {item.kategori.namaKategori}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-xs leading-tight truncate">
                      {item.namaProduk}
                    </h3>

                    <span
                      className={`inline-block px-1.5 py-0.5 my-1 text-[9px] font-semibold text-white rounded-md ${
                        item.stok > 5 ? "bg-[#5F04E8]" : "bg-orange-500"
                      }`}
                    >
                      {item.stok > 5 ? `Tersedia ${item.stok}` : `Tersisa ${item.stok}`}
                    </span>

                    <p className="text-xs font-semibold">
                      {formatRupiah(item.hargaDefault)}
                    </p>
                  </div>
                </div>
              ))}

              {produkTersaring.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400">
                  Produk tidak ditemukan.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== KANAN : KERANJANG PESANAN (panel utuh, seperti semula tapi dikecilkan) ===== */}
      <div className="w-full lg:w-[300px] bg-white rounded-2xl shadow-sm flex flex-col min-h-0">
        {/* header keranjang (TIDAK ikut scroll) */}
        <div className="p-4 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-orange-500">Keranjang Pesanan</h2>
            <GiShoppingBag className="text-orange-500" size={20} />
          </div>

          <p className="text-[11px] text-gray-400 mb-0.5">{formatTanggal(waktu)}</p>
          <p className="text-orange-500 font-bold text-xs">Order: {orderId}</p>
        </div>

        {/* daftar item -- INI yang discroll, dikecilin supaya lebih banyak item kelihatan */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-2.5">
          {keranjang.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-8">
              Belum ada produk di keranjang.
            </p>
          )}

          {keranjang.map((item) => (
            <div
              key={item.produk.idProduk}
              className="flex gap-2 items-start border-b border-gray-100 pb-2.5"
            >
              <div className="w-9 h-9 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                {item.produk.gambarUrl && (
                  <img
                    src={item.produk.gambarUrl}
                    alt={item.produk.namaProduk}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <p className="font-semibold text-xs text-gray-800 truncate">
                    {item.produk.namaProduk}
                  </p>
                  <button
                    onClick={() => hapusItem(item.produk.idProduk)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>

                <p className="text-[10px] text-gray-400">
                  Qty: {item.qty} x {formatRupiah(item.hargaJual)}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => ubahQty(item.produk.idProduk, -1)}
                      className="w-4 h-4 rounded-full border border-gray-300 text-gray-500 text-[10px] flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xs">{item.qty}</span>
                    <button
                      onClick={() => ubahQty(item.produk.idProduk, 1)}
                      className="w-4 h-4 rounded-full border border-gray-300 text-gray-500 text-[10px] flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-bold text-[#5F04E8] text-xs">
                    {formatRupiah(item.qty * item.hargaJual)}
                  </span>
                </div>

                {editHargaId === item.produk.idProduk ? (
                  <input
                    type="number"
                    autoFocus
                    defaultValue={item.hargaJual}
                    onBlur={(e) => {
                      ubahHarga(item.produk.idProduk, e.target.value);
                      setEditHargaId(null);
                    }}
                    className="w-full mt-1.5 px-1.5 py-1 text-[11px] border border-orange-300 rounded-md focus:outline-none"
                  />
                ) : (
                  <button
                    onClick={() => setEditHargaId(item.produk.idProduk)}
                    className="mt-1.5 text-[10px] px-1.5 py-0.5 border border-orange-400 text-orange-500 rounded-md"
                  >
                    Atur Harga
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* footer pembayaran -- tetap di bagian bawah panel kanan seperti semula, ukuran dikecilkan */}
        <div className="flex-shrink-0 p-4 pt-3">
          <div className="bg-orange-500 text-white rounded-lg p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span>Jumlah Bayar</span>
              <input
                type="number"
                value={jumlahBayar}
                onChange={(e) => setJumlahBayar(e.target.value)}
                placeholder="Rp0"
                className="w-24 text-right px-1.5 py-1 rounded text-orange-600 font-semibold text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Kembalian</span>
              <span className="font-semibold">
                {formatRupiah(kembalian > 0 ? kembalian : 0)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm font-bold pt-1 border-t border-white/30">
              <span>Total</span>
              <span>{formatRupiah(totalPesanan)}</span>
            </div>

            <div className="flex items-center gap-1.5 pt-1.5">
              {/* tombol QR Code cuma muncul kalau metode pembayaran Cashless */}
              {isCashless && (
                <button
                  type="button"
                  className="flex items-center justify-center gap-1 px-2 py-1.5 bg-white text-orange-500 rounded-md text-[11px] font-semibold"
                >
                  <FaQrcode size={11} /> QR
                </button>
              )}

              <button
                type="button"
                disabled={submitting}
                onClick={handleProsesPesanan}
                className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-900 transition rounded-md text-[11px] font-semibold disabled:opacity-50"
              >
                {submitting ? "Memproses..." : "Proses Pesanan"}
              </button>
            </div>
          </div>

          {pesan && (
            <p className="text-[11px] text-center mt-2 text-orange-600 font-medium">
              {pesan}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transaksi;