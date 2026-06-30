import { useEffect, useMemo, useState } from "react";
import { getAllTransaksi } from "../api/transaksiApi";
import { getAllDetailTransaksi } from "../api/detailTransaksiApi";

import SearchBar from "../components/SearchBar";

import { FaUserCircle, FaPrint, FaMoneyBillWave, FaQrcode, FaShoppingBag, FaCar, FaMotorcycle } from "react-icons/fa";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

// format ala "17 - 05 - 2026 : 17:08:56"
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

function isHariIni(tanggal) {
  if (!tanggal) return false;
  const d = new Date(tanggal);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function RiwayatHarian() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [jamSekarang, setJamSekarang] = useState(new Date());
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setJamSekarang(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [transaksiData, detailData] = await Promise.all([
          getAllTransaksi(),
          getAllDetailTransaksi(),
        ]);
        setTransaksiList(transaksiData);
        setDetailList(detailData);
      } catch (error) {
        console.error("Gagal mengambil data riwayat harian:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const itemsByOrder = useMemo(() => {
    const map = {};
    detailList.forEach((d) => {
      const id = d.transaksi?.orderId;
      if (!id) return;
      if (!map[id]) map[id] = [];
      map[id].push(d);
    });
    return map;
  }, [detailList]);

  // hanya transaksi hari ini (reset otomatis tiap pukul 23.59 karena tanggalnya beda)
  const transaksiHariIni = useMemo(
    () => transaksiList.filter((t) => isHariIni(t.tanggalTransaksi)),
    [transaksiList]
  );

  const ringkasan = useMemo(() => {
    let cash = 0;
    let cashless = 0;
    transaksiHariIni.forEach((t) => {
      if (t.metodePembayaran?.toUpperCase() === "CASH") {
        cash += Number(t.jumlahBayar || 0);
      } else {
        cashless += Number(t.jumlahBayar || 0);
      }
    });
    return {
      cash,
      cashless,
      jumlahTransaksi: transaksiHariIni.length,
      totalPemasukan: cash + cashless,
    };
  }, [transaksiHariIni]);

  const dataTersaring = useMemo(() => {
    const kw = keyword.toLowerCase();
    return transaksiHariIni.filter(
      (t) =>
        t.namaPemesan?.toLowerCase().includes(kw) ||
        t.orderId?.toLowerCase().includes(kw)
    );
  }, [transaksiHariIni, keyword]);

  return (
    <div className="flex flex-col -m-8 p-4 bg-gray-50 h-[calc(100vh-2rem)] overflow-hidden text-sm">
      <div className="bg-white text-gray-800 rounded-2xl shadow-sm flex flex-col flex-1 min-h-0">
        {/* header (TIDAK ikut scroll) */}
        <div className="p-4 lg:p-5 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
            <div>
              <h1 className="text-lg font-bold text-gray-800">Riwayat Harian</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Informasi direset setiap pukul 23.59
              </p>
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {formatTanggalHeader(jamSekarang)}
            </p>
          </div>

          {/* ringkasan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 items-stretch">
            <div className="rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                <FaMoneyBillWave className="text-orange-500" /> Pemasukan Cash
              </span>
              <p className="text-lg font-bold text-[#5F04E8] mt-1">
                {formatRupiah(ringkasan.cash)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                <FaQrcode className="text-orange-500" /> Pemasukan Cashless
              </span>
              <p className="text-lg font-bold text-[#5F04E8] mt-1">
                {formatRupiah(ringkasan.cashless)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                <FaShoppingBag className="text-orange-500" /> Total Transaksi
              </span>
              <p className="text-lg font-bold text-[#5F04E8] mt-1">
                {ringkasan.jumlahTransaksi}
              </p>
            </div>

            <div className="rounded-xl bg-orange-500 text-white shadow-sm p-3 flex flex-col justify-between">
              <span className="text-[11px] font-semibold">Total Pemasukan</span>
              <p className="text-lg font-bold mt-1">
                {formatRupiah(ringkasan.totalPemasukan)}
              </p>
            </div>
          </div>

          <div className="flex justify-end mb-3">
            <SearchBar
              theme="purple"
              placeholder="Search by name or order..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* grid kartu transaksi -- INI yang discroll */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 lg:px-5 pb-5">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat riwayat transaksi...</div>
          ) : dataTersaring.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Belum ada transaksi hari ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {dataTersaring.map((t) => {
                const items = itemsByOrder[t.orderId] || [];
                const isDelivery = t.metodePengiriman?.toUpperCase() === "DELIVERY";
                const isCash = t.metodePembayaran?.toUpperCase() === "CASH";

                return (
                  <div
                    key={t.orderId}
                    className="border border-gray-100 rounded-xl shadow-sm p-3.5 flex flex-col bg-white"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FaUserCircle className="text-[#5F04E8] flex-shrink-0" size={28} />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#5F04E8] truncate">
                            {t.namaPemesan}
                          </p>
                          <p className="text-[11px] text-gray-400">{t.noWhatsapp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          title="Cetak struk"
                          className="text-gray-400 hover:text-[#5F04E8] transition"
                          onClick={() => window.print()}
                        >
                          <FaPrint size={13} />
                        </button>
                        <span className="px-2 py-0.5 rounded-full bg-[#5F04E8]/10 text-[#5F04E8] text-[10px] font-bold whitespace-nowrap">
                          #{t.orderId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 flex-wrap gap-1.5">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">
                        {isDelivery ? <FaMotorcycle className="text-orange-500" /> : <FaCar className="text-orange-500" />}
                        {isDelivery ? "Delivery" : "Pick Up"}
                      </span>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">
                        {t.tanggalTransaksi
                          ? formatTanggal(new Date(t.tanggalTransaksi))
                          : "-"}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] font-semibold text-gray-400 mb-1">
                        <span>Items</span>
                        <span className="flex gap-6">
                          <span>Qty</span>
                          <span>Harga</span>
                        </span>
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {items.map((d) => (
                          <div
                            key={d.idDetailTransaksi}
                            className="flex justify-between text-xs text-gray-700"
                          >
                            <span className="truncate pr-2">{d.produk?.namaProduk}</span>
                            <span className="flex gap-6 flex-shrink-0">
                              <span className="w-4 text-center">{d.qty}</span>
                              <span>{formatRupiah(d.hargaJual)}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-100 text-xs">
                      <span className="text-gray-500 font-medium">Metode Pembayaran</span>
                      <span
                        className={`font-semibold ${
                          isCash ? "text-orange-500" : "text-[#5F04E8]"
                        }`}
                      >
                        {isCash ? "Cash" : "Cashless"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-1 text-xs">
                      <span className="text-gray-500 font-medium">Total Bayar</span>
                      <span className="text-gray-700 font-semibold">
                        {formatRupiah(t.jumlahBayar)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-1 text-xs">
                      <span className="text-gray-500 font-medium">Kembalian</span>
                      <span className="text-gray-700 font-semibold">
                        {formatRupiah(t.kembalian)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                      <span className="text-sm font-bold text-gray-700">Total</span>
                      <span className="font-bold text-[#5F04E8] text-base">
                        {formatRupiah(t.totalPesanan)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiwayatHarian;