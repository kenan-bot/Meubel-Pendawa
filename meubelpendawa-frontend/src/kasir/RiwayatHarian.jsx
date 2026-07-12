import { useEffect, useMemo, useState } from "react";
import { getAllTransaksi } from "../api/transaksiApi";
import { getAllDetailTransaksi } from "../api/detailTransaksiApi";

import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { exportLaporanHarian } from "../api/laporanHarianApi";
import { LuDownload } from "react-icons/lu";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card"; // [REUSE] kartu ringkasan pakai Card generic
import TransaksiCard from "../components/TransaksiCard"; // [REUSE] kartu transaksi variant="riwayat"

import { FaMoneyBillWave, FaQrcode, FaShoppingBag } from "react-icons/fa";

function formatRupiah(nominal) {
  const angka = Number(nominal || 0);

  return "Rp" + angka.toLocaleString("id-ID");
}

function isHariIni(tanggal) {
  if (!tanggal) return false;

  const tanggalData = new Date(tanggal);
  const sekarang = new Date();

  return (
    tanggalData.getDate() === sekarang.getDate() &&
    tanggalData.getMonth() === sekarang.getMonth() &&
    tanggalData.getFullYear() === sekarang.getFullYear()
  );
}

// Card ringkasan laporan
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

  // Export laporan
  const [exportLoading, setExportLoading] = useState(false);

  const [showConfirmExport, setShowConfirmExport] = useState(false);

  // Toast
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Auto hide toast 3 detik
  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast({
        show: false,
        type: "",
        message: "",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  // Load transaksi
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

    detailList.forEach((detail) => {
      const orderId = detail.transaksi?.orderId;

      if (!orderId) return;

      if (!map[orderId]) {
        map[orderId] = [];
      }

      map[orderId].push(detail);
    });

    return map;
  }, [detailList]);

  const transaksiHariIni = useMemo(() => {
    return transaksiList.filter((t) => {
      return (
        isHariIni(t.tanggalTransaksi) &&
        t.statusPembayaran?.toUpperCase() === "SUCCESS"
      );
    });
  }, [transaksiList]);

  const ringkasan = useMemo(() => {
    const hasil = transaksiHariIni.reduce(
      (acc, transaksi) => {
        const total = Number(transaksi.totalPesanan || 0);

        if (transaksi.metodePembayaran?.toUpperCase() === "CASH") {
          acc.cash += total;
        } else {
          acc.cashless += total;
        }

        acc.jumlahTransaksi++;

        return acc;
      },

      {
        cash: 0,
        cashless: 0,
        jumlahTransaksi: 0,
      },
    );

    return {
      ...hasil,

      totalPemasukan: hasil.cash + hasil.cashless,
    };
  }, [transaksiHariIni]);

  const ringkasanCards = useMemo(
    () => buildRingkasanCards(ringkasan),
    [ringkasan],
  );

  const dataTersaring = useMemo(() => {
    const kw = keyword.toLowerCase().trim();

    if (!kw) {
      return transaksiHariIni;
    }

    return transaksiHariIni.filter(
      (t) =>
        t.namaPemesan?.toLowerCase().includes(kw) ||
        t.orderId?.toLowerCase().includes(kw),
    );
  }, [transaksiHariIni, keyword]);

  const handleClickExport = () => {
    setShowConfirmExport(true);
  };

  const handleConfirmExport = async () => {
    try {
      setExportLoading(true);

      await exportLaporanHarian();

      setToast({
        show: true,
        type: "success",
        message:
          "Laporan harian berhasil dibuat dan dikirim ke email perusahaan.",
      });
    } catch (error) {
      console.error("Export laporan gagal:", error);

      setToast({
        show: true,
        type: "error",
        message: "Gagal membuat laporan harian.",
      });
    } finally {
      setExportLoading(false);
      setShowConfirmExport(false);
    }
  };
  
  return (
    <div className="relative px-3 py-5 md:px-5">
      {/* Header */}
      <div className="mb-6 md:-mt-7">
        <h1 className="text-2xl font-extrabold md:text-3xl">Laporan Harian</h1>

        <p className="text-sm text-gray-500 md:text-base">
          Laporan akan direset pada pukul 23.59
        </p>
      </div>

      {/* Ringkasan */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Search dan Export */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <SearchBar
          theme="orange"
          placeholder="Cari nama, ID..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button
          type="button"
          onClick={handleClickExport}
          disabled={exportLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2
          text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-orange-600
          disabled:cursor-not-allowed disabled:opacity-60 md:ml-auto md:w-auto"
        >
          <LuDownload size={18} />

          {exportLoading ? "Mengirim..." : "Ekspor Laporan"}
        </button>
      </div>

      {/* Daftar Transaksi */}
      <div className="mt-3">
        {loading ? (
          <div className="py-24 text-center text-gray-500">
            Memuat riwayat transaksi...
          </div>
        ) : dataTersaring.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-semibold text-gray-500">
              Belum ada transaksi hari ini
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Transaksi yang berhasil diproses akan muncul di sini.
            </p>
          </div>
        ) : (
          <div
            className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-3
          "
          >
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

      {/* CONFIRM EXPORT */}

      <ConfirmModal
        isOpen={showConfirmExport}
        title="Ekspor Laporan Harian?"
        message="Sistem akan membuat file PDF laporan hari ini dan mengirimkannya ke email perusahaan."
        confirmText={exportLoading ? "Mengirim..." : "Ya, Ekspor"}
        cancelText="Batal"
        onConfirm={handleConfirmExport}
        onClose={() => setShowConfirmExport(false)}
      />

      {/* TOAST */}

      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

export default RiwayatHarian;
