import { useEffect, useMemo, useState } from "react";
import { getAllTransaksi } from "../api/transaksiApi";
import { getAllDetailTransaksi } from "../api/detailTransaksiApi";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import DateTimeDisplay from "../components/DateTimeDisplay";
import TransaksiCard from "../components/TransaksiCard"; // [REUSE] kartu sudah punya variant="pengiriman"

const TAB_LIST = [
  { key: "ON_PROCESS", label: "On Process", active: "bg-orange-500 text-white", idle: "bg-white text-orange-500 border border-orange-300" },
  { key: "COMPLETED", label: "Completed", active: "bg-[#5F04E8] text-white", idle: "bg-white text-[#5F04E8] border border-[#5F04E8]/40" },
];

function StatusPengiriman() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [tabStatus, setTabStatus] = useState("ON_PROCESS"); // ON_PROCESS | COMPLETED

  // status pengiriman per orderId (sementara disimpan lokal,
  // karena tabel transaksi belum punya kolom status pengiriman di backend)
  const [statusMap, setStatusMap] = useState({});

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
    const kw = keyword.toLowerCase();
    return transaksiList.filter((t) => {
      const status = statusMap[t.orderId] || "ON_PROCESS";
      const cocokStatus = status === tabStatus;
      const cocokKeyword =
        t.namaPemesan?.toLowerCase().includes(kw) ||
        t.orderId?.toLowerCase().includes(kw);
      return cocokStatus && cocokKeyword;
    });
  }, [transaksiList, statusMap, tabStatus, keyword]);

  // Kasir hanya bisa MELIHAT status pengiriman, tidak bisa mengubahnya.
  // Perubahan status (proses -> selesai) hanya dilakukan oleh driver/role lain di halaman lain.

  return (
    <div className="flex flex-col -m-8 p-4 bg-gray-50 h-[calc(100vh-2rem)] overflow-hidden text-sm">
      <div className="bg-white text-gray-800 rounded-2xl shadow-sm flex flex-col flex-1 min-h-0">
        {/* header (TIDAK ikut scroll) */}
        <div className="p-4 lg:p-5 pb-0 flex-shrink-0 relative">
          {/* [SESUAI CONTOH] tanggal/jam nempel di pojok kanan atas, sejajar judul */}
          <div className="absolute top-4 right-4 lg:top-5 lg:right-5">
            <DateTimeDisplay />
          </div>

          <PageHeader
            title="Lihat Status Pengiriman"
            subtitle="Halaman untuk memantau status pengiriman"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              {TAB_LIST.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTabStatus(tab.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                    tabStatus === tab.key ? tab.active : tab.idle
                  }`}
                >
                  {tab.label}
                </button>
              ))}
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
              {dataTersaring.map((t) => (
                <TransaksiCard
                  key={t.orderId}
                  transaksi={t}
                  items={itemsByOrder[t.orderId] || []}
                  variant="pengiriman"
                  statusPengiriman={statusMap[t.orderId] || "ON_PROCESS"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatusPengiriman;