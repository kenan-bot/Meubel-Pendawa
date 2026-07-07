import { useEffect, useMemo, useState } from "react";

import { usePengiriman } from "../context/PengirimanContext";

import { getAllTransaksi } from "../api/transaksiApi";
import { getAllDetailTransaksi } from "../api/detailTransaksiApi";

import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import usePagination from "../hooks/usePagination";
import TransaksiCard from "./TransaksiCard";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";

const TAB_LIST = [
  {
    key: "ON_PROCESS",
    label: "On Process",
    active: "bg-orange-500 text-white",
    idle: "bg-white text-orange-500 border border-orange-300",
  },
  {
    key: "COMPLETED",
    label: "Completed",
    active: "bg-[#5F04E8] text-white",
    idle: "bg-white text-[#5F04E8] border border-[#5F04E8]/40",
  },
];

function StatusPengirimanPage({ role = "kasir" }) {
  const { pengiriman, completePengiriman } = usePengiriman();

  const [transaksiList, setTransaksiList] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [tabStatus, setTabStatus] = useState("ON_PROCESS");

  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const canUpdate = role === "driver";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [transaksiRes, detailRes] = await Promise.allSettled([
          getAllTransaksi(),
          getAllDetailTransaksi(),
        ]);

        const transaksiData =
          transaksiRes.status === "fulfilled" ? transaksiRes.value : [];

        const detailData =
          detailRes.status === "fulfilled" ? detailRes.value : [];

        const deliveryOnly = transaksiData.filter(
          (t) => t.metodePengiriman?.toUpperCase() === "DELIVERY",
        );

        setTransaksiList(deliveryOnly);
        setDetailList(detailData);
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
      const orderId = d.transaksi?.orderId;

      if (!orderId) return;

      if (!map[orderId]) {
        map[orderId] = [];
      }

      map[orderId].push(d);
    });

    return map;
  }, [detailList]);

  const getPengirimanByOrder = (orderId) =>
    pengiriman.find((p) => p.transaksi?.orderId === orderId);

  const getStatusPengiriman = (orderId) =>
    getPengirimanByOrder(orderId)?.statusPengiriman || "ON_PROCESS";

  const handleUpdateStatus = (transaksi) => {
    setSelectedTransaksi(transaksi);
    setShowConfirm(true);
  };

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3000);
  };

  const confirmUpdateStatus = async () => {
    try {
      if (!selectedTransaksi) return;

      const dataPengiriman = getPengirimanByOrder(selectedTransaksi.orderId);

      if (!dataPengiriman) return;

      await completePengiriman(dataPengiriman.idPengiriman);

      showToast("Pengiriman berhasil diselesaikan", "success");
    } catch (error) {
      console.error(error);

      showToast("Gagal mengubah status pengiriman", "error");
    } finally {
      setShowConfirm(false);
      setSelectedTransaksi(null);
    }
  };

  const dataTersaring = useMemo(() => {
    const kw = keyword.toLowerCase();

    return transaksiList
      .filter((t) => {
        // [BARU] hanya tampilkan order yang memang SUDAH punya record pengiriman asli.
        // Record pengiriman baru dibuat backend setelah statusPembayaran = SUCCESS, jadi
        // order cashless yang masih pending/batal/gagal otomatis tidak akan lolos di sini.
        const dataPengiriman = getPengirimanByOrder(t.orderId);
        if (!dataPengiriman) return false;

        const status = dataPengiriman.statusPengiriman || "ON_PROCESS";

        const cocokStatus = status === tabStatus;

        const cocokKeyword =
          t.namaPemesan?.toLowerCase().includes(kw) ||
          t.orderId?.toLowerCase().includes(kw);

        return cocokStatus && cocokKeyword;
      })
      .sort((a, b) => {
        if (tabStatus === "ON_PROCESS") {
          return new Date(a.tanggalTransaksi) - new Date(b.tanggalTransaksi);
        }

        return new Date(b.tanggalTransaksi) - new Date(a.tanggalTransaksi);
      });
  }, [transaksiList, pengiriman, tabStatus, keyword]);

  const {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(dataTersaring, 9);

  return (
    <>
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTabStatus(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-300 ${
                tabStatus === tab.key ? tab.active : tab.idle
              }`}
            >
              {tab.label}
            </button>
          ))}

          <SearchBar
            theme="orange"
            placeholder="Cari nama customer atau ID order..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Memuat data pengiriman...
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          Tidak ada pesanan dengan status ini.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedData.map((t) => (
              <TransaksiCard
                key={t.orderId}
                transaksi={t}
                items={itemsByOrder[t.orderId] || []}
                variant="pengiriman"
                statusPengiriman={getStatusPengiriman(t.orderId)}
                canUpdate={canUpdate}
                onUpdateStatus={canUpdate ? handleUpdateStatus : undefined}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title="Selesaikan Pengiriman"
        message="Apakah Anda yakin ingin menyelesaikan pengiriman ini?"
        confirmText="Ya, Selesaikan"
        cancelText="Batal"
        onConfirm={confirmUpdateStatus}
        onClose={() => {
          setShowConfirm(false);
          setSelectedTransaksi(null);
        }}
      />
    </>
  );
}

export default StatusPengirimanPage;
