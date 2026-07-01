import { useEffect, useMemo, useState } from "react";
import { getAllTransaksi } from "../api/transaksiApi";
import { getAllDetailTransaksi } from "../api/detailTransaksiApi";
import { getAllPengiriman } from "../api/pengirimanApi";

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

  // filter tanggal -- hanya relevan & ditampilkan saat tab Completed aktif,
  // supaya data yang sudah selesai (numpuk dari hari ke hari) bisa disaring per tanggal tertentu.
  // Default: tanggal hari ini (sysdate), bukan "tampilkan semua", biar tidak numpuk pas pertama buka.
  const [tanggalFilter, setTanggalFilter] = useState(() => new Date().toLocaleDateString("en-CA"));

  // status pengiriman per orderId, dibaca langsung dari tabel `pengiriman` di database
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [transaksiRes, detailRes, pengirimanRes] = await Promise.allSettled([
          getAllTransaksi(),
          getAllDetailTransaksi(),
          getAllPengiriman(),
        ]);

        const transaksiData = transaksiRes.status === "fulfilled" ? transaksiRes.value : [];
        const detailData = detailRes.status === "fulfilled" ? detailRes.value : [];
        const pengirimanData = pengirimanRes.status === "fulfilled" ? pengirimanRes.value : [];

        if (transaksiRes.status === "rejected") console.error("Gagal mengambil transaksi:", transaksiRes.reason);
        if (detailRes.status === "rejected") console.error("Gagal mengambil detail transaksi:", detailRes.reason);
        if (pengirimanRes.status === "rejected") console.error("Gagal mengambil status pengiriman:", pengirimanRes.reason);

        const dataDelivery = transaksiData.filter(
          (t) => t.metodePengiriman?.toUpperCase() === "DELIVERY"
        );

        setTransaksiList(dataDelivery);
        setDetailList(detailData);

        // bangun peta status dari data pengiriman asli (bukan hardcode lagi)
        const nextStatusMap = {};
        pengirimanData.forEach((p) => {
          const orderId = p.transaksi?.orderId;
          if (!orderId) return;
          nextStatusMap[orderId] = p.statusPengiriman || "ON_PROCESS";
        });
        setStatusMap(nextStatusMap);
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

    // tanggal hanya dipakai kalau lagi di tab Completed (dan kalau memang dipilih)
    const tanggalAktif = tabStatus === "COMPLETED" ? tanggalFilter : "";

    return transaksiList.filter((t) => {
      const status = statusMap[t.orderId] || "ON_PROCESS";
      const cocokStatus = status === tabStatus;

      const cocokKeyword =
        t.namaPemesan?.toLowerCase().includes(kw) ||
        t.orderId?.toLowerCase().includes(kw);

      let cocokTanggal = true;
      if (tanggalAktif) {
        // bandingkan tanggal lokal (yyyy-mm-dd) saja, tanpa jam
        const tanggalTransaksi = t.tanggalTransaksi
          ? new Date(t.tanggalTransaksi).toLocaleDateString("en-CA") // format yyyy-mm-dd
          : null;
        cocokTanggal = tanggalTransaksi === tanggalAktif;
      }

      return cocokStatus && cocokKeyword && cocokTanggal;
    });
  }, [transaksiList, statusMap, tabStatus, keyword, tanggalFilter]);

  // Kasir hanya bisa MELIHAT status pengiriman, tidak bisa mengubahnya.
  // Perubahan status (proses -> selesai) hanya dilakukan oleh driver/role lain di halaman lain.

  return (
    <div className="flex flex-col -m-8 p-4 bg-gray-50 h-[calc(100vh-2rem)] overflow-hidden text-sm">
      <div className="bg-white text-gray-800 rounded-2xl shadow-sm flex flex-col flex-1 min-h-0">
        {/* header (TIDAK ikut scroll) */}
        <div className="p-4 lg:p-5 pb-0 flex-shrink-0 relative">
          {/* [SESUAI CONTOH] tanggal/jam nempel di pojok kanan atas, sejajar judul -- hanya di layar lg+ */}
          <div className="hidden lg:block absolute top-5 right-5">
            <DateTimeDisplay />
          </div>

          <PageHeader
            title="Lihat Status Pengiriman"
            subtitle="Halaman untuk memantau status pengiriman"
          />

          {/* [RESPONSIVE] di layar kecil, tanggal/jam ditaruh di bawah judul (bukan absolute) supaya tidak numpuk */}
          <div className="lg:hidden mb-4 -mt-4">
            <DateTimeDisplay />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {TAB_LIST.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setTabStatus(tab.key);
                    if (tab.key !== "COMPLETED") {
                      // reset filter tanggal supaya tidak "nyangkut" saat balik ke On Process
                      setTanggalFilter("");
                    }
                  }}
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

          {/* [BARU] filter tanggal -- hanya muncul di tab Completed, default hari ini (sysdate),
              karena data selesai akan terus numpuk dari hari ke hari */}
          {tabStatus === "COMPLETED" && (
            <div className="flex flex-wrap items-end gap-2 mb-4 p-2.5 rounded-lg bg-[#5F04E8]/5 border border-[#5F04E8]/10">
              <div>
                <label className="block mb-1 text-[10px] font-semibold text-gray-500">Tanggal selesai</label>
                <input
                  type="date"
                  value={tanggalFilter}
                  onChange={(e) => setTanggalFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#5F04E8]"
                />
              </div>
            </div>
          )}
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