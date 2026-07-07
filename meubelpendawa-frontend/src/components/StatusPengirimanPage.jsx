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
import DateRangePicker from "./DateRangePicker";
import DropDownFilter from "./DropDownFilter";

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

  // State
  const [transaksiList, setTransaksiList] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [tabStatus, setTabStatus] = useState("ON_PROCESS");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const canUpdate = role === "driver";

  // Pagination Reset
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, tabStatus, startDate, endDate, selectedDriver]);

  // Load Data
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

        setTransaksiList(
          transaksiData.filter(
            (t) => t.metodePengiriman?.toUpperCase() === "DELIVERY",
          ),
        );

        setDetailList(detailData);
      } catch (error) {
        console.error("Gagal mengambil data status pengiriman:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Mapping Detail
  const itemsByOrder = useMemo(() => {
    const map = {};

    detailList.forEach((item) => {
      const orderId = item.transaksi?.orderId;

      if (!orderId) return;

      if (!map[orderId]) {
        map[orderId] = [];
      }

      map[orderId].push(item);
    });

    return map;
  }, [detailList]);

  // Mapping Pengiriman
  const pengirimanByOrder = useMemo(() => {
    const map = {};

    pengiriman.forEach((item) => {
      const orderId = item.transaksi?.orderId;

      if (orderId) {
        map[orderId] = item;
      }
    });

    return map;
  }, [pengiriman]);

  // data driver
  const driverOptions = useMemo(() => {
    const uniqueDriver = new Map();

    pengiriman.forEach((item) => {
      const driver = item.driver;

      if (!driver) return;

      uniqueDriver.set(driver.idKaryawan, {
        value: driver.idKaryawan,
        label: driver.namaKaryawan,
      });
    });

    return [...uniqueDriver.values()];
  }, [pengiriman]);

  // Helpers
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

      const dataPengiriman = pengirimanByOrder[selectedTransaksi.orderId];

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

  // Filter + Sort
  const dataTersaring = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    return transaksiList
      .filter((t) => {
        const dataPengiriman = pengirimanByOrder[t.orderId];

        if (!dataPengiriman) return false;

        const cocokStatus = dataPengiriman.statusPengiriman === tabStatus;

        const cocokKeyword =
          t.namaPemesan?.toLowerCase().includes(kw) ||
          t.orderId?.toLowerCase().includes(kw);

        const cocokDriver =
          !selectedDriver ||
          selectedDriver.value === "__ALL__" ||
          dataPengiriman.driver?.idKaryawan === selectedDriver.value;

        let cocokTanggal = true;

        if (tabStatus === "COMPLETED") {
          const tanggalSelesai = dataPengiriman.tanggalSelesai;

          if (tanggalSelesai) {
            const tanggal = new Date(tanggalSelesai);

            if (startDate) {
              cocokTanggal = cocokTanggal && tanggal >= new Date(startDate);
            }

            if (endDate) {
              const end = new Date(endDate);
              end.setHours(23, 59, 59, 999);

              cocokTanggal = cocokTanggal && tanggal <= end;
            }
          }
        }

        return cocokStatus && cocokKeyword && cocokDriver && cocokTanggal;
      })
      .sort((a, b) => {
        if (tabStatus === "ON_PROCESS") {
          return new Date(a.tanggalTransaksi) - new Date(b.tanggalTransaksi);
        }

        const selesaiA = pengirimanByOrder[a.orderId]?.tanggalSelesai;

        const selesaiB = pengirimanByOrder[b.orderId]?.tanggalSelesai;

        return new Date(selesaiB || 0) - new Date(selesaiA || 0);
      });
  }, [
    transaksiList,
    pengirimanByOrder,
    tabStatus,
    keyword,
    startDate,
    endDate,
    selectedDriver,
  ]);

  const {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    setCurrentPage,
  } = usePagination(dataTersaring, 9);

  return (
    <>
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* KIRI */}
        <div className="flex flex-wrap items-center gap-3">
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
            placeholder="cari id, nama.."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          {(role === "owner" || role === "kasir") && (
            <DropDownFilter
              title="Pilih Driver"
              items={driverOptions}
              value={selectedDriver}
              onSelect={setSelectedDriver}
              theme="orange"
            />
          )}
        </div>

        {/* KANAN */}
        {tabStatus === "COMPLETED" && (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onReset={() => {
              setStartDate("");
              setEndDate("");
            }}
          />
        )}
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
                statusPengiriman={
                  pengirimanByOrder[t.orderId]?.statusPengiriman
                }
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
