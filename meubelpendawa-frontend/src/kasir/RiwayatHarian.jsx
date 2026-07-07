import { useEffect, useMemo, useState } from "react";
import { getAllTransaksi } from "../api/transaksiApi";
import { getAllDetailTransaksi } from "../api/detailTransaksiApi";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import DateTimeDisplay from "../components/DateTimeDisplay";
import Card from "../components/Card"; // [REUSE] kartu ringkasan pakai Card generic
import TransaksiCard from "../components/TransaksiCard"; // [REUSE] kartu transaksi variant="riwayat"

import { FaMoneyBillWave, FaQrcode, FaShoppingBag } from "react-icons/fa";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
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

// ringkasan yang ditampilkan di atas (label, icon, value, style card)
function buildRingkasanCards(ringkasan) {
  return [
    {
      key: "cash",
      icon: <FaMoneyBillWave className="text-orange-500" />,
      label: "Pemasukan Cash",
      value: formatRupiah(ringkasan.cash),
      variant: "default",
      valueClass: "text-[#5F04E8]",
    },
    {
      key: "cashless",
      icon: <FaQrcode className="text-orange-500" />,
      label: "Pemasukan Cashless",
      value: formatRupiah(ringkasan.cashless),
      variant: "default",
      valueClass: "text-[#5F04E8]",
    },
    {
      key: "jumlah",
      icon: <FaShoppingBag className="text-orange-500" />,
      label: "Total Transaksi",
      value: ringkasan.jumlahTransaksi,
      variant: "default",
      valueClass: "text-[#5F04E8]",
    },
    {
      key: "total",
      icon: null,
      label: "Total Pemasukan",
      value: formatRupiah(ringkasan.totalPemasukan),
      variant: "orange",
      valueClass: "text-white",
      labelClass: "text-white",
    },
  ];
}

function RiwayatHarian() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

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
  // DAN hanya yang pembayarannya sudah SUCCESS -- order cashless yang masih PENDING,
  // dibatalkan (FAILED), atau butuh review (CHALLENGE) belum boleh dihitung sebagai
  // pemasukan ataupun muncul di riwayat, karena uangnya belum tentu (atau belum) masuk.
  const transaksiHariIni = useMemo(
    () =>
      transaksiList.filter(
        (t) => isHariIni(t.tanggalTransaksi) && t.statusPembayaran === "SUCCESS"
      ),
    [transaksiList]
  );

  const ringkasan = useMemo(() => {
    let cash = 0;
    let cashless = 0;
    transaksiHariIni.forEach((t) => {
      if (t.metodePembayaran?.toUpperCase() === "CASH") {
        cash += Number(t.totalPesanan || 0);
      } else {
        cashless += Number(t.totalPesanan || 0);
      }
    });
    return {
      cash,
      cashless,
      jumlahTransaksi: transaksiHariIni.length,
      totalPemasukan: cash + cashless,
    };
  }, [transaksiHariIni]);

  const ringkasanCards = useMemo(() => buildRingkasanCards(ringkasan), [ringkasan]);

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
        <div className="p-4 lg:p-5 pb-0 flex-shrink-0 relative">
          {/* [SESUAI CONTOH] tanggal/jam nempel di pojok kanan atas, sejajar judul -- hanya di layar lg+ */}
          <div className="hidden lg:block absolute top-5 right-5">
            <DateTimeDisplay />
          </div>

          <PageHeader
            title="Riwayat Harian"
            subtitle="Informasi direset setiap pukul 23.59"
          />

          {/* [RESPONSIVE] di layar kecil, tanggal/jam ditaruh di bawah judul (bukan absolute) supaya tidak numpuk */}
          <div className="lg:hidden mb-4 -mt-4">
            <DateTimeDisplay />
          </div>

          {/* ringkasan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 items-stretch">
            {ringkasanCards.map((c) => (
              <Card
                key={c.key}
                variant={c.variant}
                padding="small"
                hover={false}
                className="flex flex-col justify-between"
              >
                <span
                  className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                    c.labelClass || "text-gray-500"
                  }`}
                >
                  {c.icon}
                  {c.label}
                </span>
                <p className={`text-lg font-bold mt-1 ${c.valueClass}`}>{c.value}</p>
              </Card>
            ))}
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
              {dataTersaring.map((t) => (
                <TransaksiCard
                  key={t.orderId}
                  transaksi={t}
                  items={itemsByOrder[t.orderId] || []}
                  variant="riwayat"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiwayatHarian;