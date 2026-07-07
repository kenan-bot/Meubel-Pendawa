import { useEffect, useMemo, useState } from "react";
import { getAllTransaksi } from "../api/transaksiApi";
import { getAllDetailTransaksi } from "../api/detailTransaksiApi";

import { LuDownload } from "react-icons/lu";
import SearchBar from "../components/SearchBar";
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
        (t) =>
          isHariIni(t.tanggalTransaksi) && t.statusPembayaran === "SUCCESS",
      ),
    [transaksiList],
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

  const ringkasanCards = useMemo(
    () => buildRingkasanCards(ringkasan),
    [ringkasan],
  );

  const dataTersaring = useMemo(() => {
    const kw = keyword.toLowerCase();
    return transaksiHariIni.filter(
      (t) =>
        t.namaPemesan?.toLowerCase().includes(kw) ||
        t.orderId?.toLowerCase().includes(kw),
    );
  }, [transaksiHariIni, keyword]);

  return (
    <div className="px-3 md:px-5 py-5">
      {/* Header */}
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl">Laporan Harian</h1>

        <p className="text-sm md:text-base text-gray-500">
          Laporan akan direset pada pukul 23.59
        </p>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
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

            <p
              className={`mt-2 text-xl font-extrabold leading-none ${c.valueClass}`}
            >
              {c.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Search dan ekspor button */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <SearchBar
          theme="orange"
          placeholder="Cari nama pemesan atau Order ID..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button
          type="button"
          onClick={() => {
            // nanti isi export PDF / Excel
          }}
          className="md:ml-auto flex items-center justify-center gap-2 bg-orange-500
          text-white font-medium text-sm px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300"
        >
          <LuDownload size={18} />
          Ekspor Laporan
        </button>
      </div>

      {/* Daftar Transaksi */}
      <div className="mt-3">
        {loading ? (
          <div className="py-24 text-center text-gray-500">
            Memuat riwayat transaksi...
          </div>
        ) : dataTersaring.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <div className="py-24 text-center">
              <p className="text-lg font-semibold text-gray-500">
                Belum ada transaksi hari ini
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Transaksi yang berhasil diproses akan muncul di sini.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
  );
}

export default RiwayatHarian;
