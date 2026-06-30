import { useEffect, useMemo, useState } from "react";
import { getAllTransaksi } from "../api/transaksiApi";
import { getAllDetailTransaksi } from "../api/detailTransaksiApi";

import SearchBar from "../components/SearchBar";

import { FaUserCircle, FaMotorcycle, FaMapMarkerAlt, FaTruck, FaCheckCircle } from "react-icons/fa";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

// format ala "17 - 05 - 2026 : 17:08:56" (samakan gaya dengan keranjang di Transaksi)
function formatTanggal(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${dd} - ${mm} - ${yyyy} : ${hh}:${mi}:${ss}`;
}

// format ala "Selasa, 30 Juni 2026 • Pukul 18.37.04" (samakan dengan header Form Pemesan)
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

function StatusPengiriman() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [jamSekarang, setJamSekarang] = useState(new Date());
  const [keyword, setKeyword] = useState("");
  const [tabStatus, setTabStatus] = useState("ON_PROCESS"); // ON_PROCESS | COMPLETED

  // status pengiriman per orderId (sementara disimpan lokal,
  // karena tabel transaksi belum punya kolom status pengiriman di backend)
  const [statusMap, setStatusMap] = useState({});

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

        const dataDelivery = transaksiData.filter(
          (t) => t.metodePengiriman?.toUpperCase() === "DELIVERY"
        );

        setTransaksiList(dataDelivery);
        setDetailList(detailData);

        setStatusMap((prev) => {
          const next = { ...prev };
          dataDelivery.forEach((t) => {
            if (!next[t.orderId]) next[t.orderId] = "ON_PROCESS";
          });
          return next;
        });
      } catch (error) {
        console.error("Gagal mengambil data status pengiriman:", error);
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

  const dataTersaring = useMemo(() => {
    return transaksiList.filter((t) => {
      const status = statusMap[t.orderId] || "ON_PROCESS";
      const cocokStatus = status === tabStatus;

      const kw = keyword.toLowerCase();
      const cocokKeyword =
        t.namaPemesan?.toLowerCase().includes(kw) ||
        t.orderId?.toLowerCase().includes(kw);

      return cocokStatus && cocokKeyword;
    });
  }, [transaksiList, statusMap, tabStatus, keyword]);

  const tandaiSelesai = (orderId) => {
    setStatusMap((prev) => ({ ...prev, [orderId]: "COMPLETED" }));
  };

  const tandaiProses = (orderId) => {
    setStatusMap((prev) => ({ ...prev, [orderId]: "ON_PROCESS" }));
  };

  return (
    <div className="flex flex-col -m-8 p-4 bg-gray-50 h-[calc(100vh-2rem)] overflow-hidden text-sm">
      <div className="bg-white text-gray-800 rounded-2xl shadow-sm flex flex-col flex-1 min-h-0">
        {/* header (TIDAK ikut scroll) */}
        <div className="p-4 lg:p-5 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
            <div>
              <h1 className="text-lg font-bold text-gray-800">Lihat Status Pengiriman</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Halaman untuk memantau status pengiriman
              </p>
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {formatTanggalHeader(jamSekarang)}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTabStatus("ON_PROCESS")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  tabStatus === "ON_PROCESS"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-orange-500 border border-orange-300"
                }`}
              >
                On Process
              </button>
              <button
                onClick={() => setTabStatus("COMPLETED")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  tabStatus === "COMPLETED"
                    ? "bg-[#5F04E8] text-white"
                    : "bg-white text-[#5F04E8] border border-[#5F04E8]/40"
                }`}
              >
                Completed
              </button>
            </div>

            <SearchBar
              theme="purple"
              placeholder="Search by name or order..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* grid kartu pengiriman -- INI yang discroll */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 lg:px-5 pb-5">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat data pengiriman...</div>
          ) : dataTersaring.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Tidak ada pesanan dengan status ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {dataTersaring.map((t) => {
                const items = itemsByOrder[t.orderId] || [];
                const status = statusMap[t.orderId] || "ON_PROCESS";
                const isCompleted = status === "COMPLETED";

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
                      <span className="px-2 py-0.5 rounded-full bg-[#5F04E8]/10 text-[#5F04E8] text-[10px] font-bold whitespace-nowrap">
                        #{t.orderId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 px-2 py-1.5 rounded-md bg-gray-50 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1 truncate">
                        <FaMotorcycle className="text-orange-500 flex-shrink-0" />
                        {t.driver?.namaKaryawan || "-"}
                      </span>
                      <span className="whitespace-nowrap">
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

                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-100">
                      <span className="text-xs font-semibold text-gray-500">Total</span>
                      <span className="font-bold text-[#5F04E8] text-sm">
                        {formatRupiah(t.totalPesanan)}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5 mt-2 px-2.5 py-2 rounded-md border border-gray-200 text-[11px] text-gray-500">
                      <FaMapMarkerAlt className="text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>{t.alamatPengiriman}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        isCompleted ? tandaiProses(t.orderId) : tandaiSelesai(t.orderId)
                      }
                      className={`mt-3 w-full flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-semibold text-white transition ${
                        isCompleted ? "bg-[#5F04E8] hover:bg-[#4d03c0]" : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      {isCompleted ? <FaCheckCircle size={12} /> : <FaTruck size={12} />}
                      {isCompleted ? "Completed" : "On Process"}
                    </button>
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

export default StatusPengiriman;