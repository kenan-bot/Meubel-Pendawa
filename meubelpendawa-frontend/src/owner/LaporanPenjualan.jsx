import DropDownFilter from "../components/DropDownFilter";
import DateRangePicker from "../components/DateRangePicker";
import DetailTransaksiTable from "../components/DetailTransaksiTable";
import AnimatedCount from "../components/AnimatedCount";
import { MdDateRange } from "react-icons/md";
import AnimatedProgressBar from "../components/AnimatedProgressBar";
import Card from "../components/Card";
import MiniChart from "../components/MiniChart";
import LineChartCard from "../components/LineChartCard";
import { LuDownload } from "react-icons/lu";
import Modal from "../components/Modal";
import { useEffect, useState } from "react";
import {
  getSummaryLaporanPenjualan,
  getSummaryLaporanPenjualanByPeriode,
  getDetailLaporanPenjualan,
  getKontribusiProduk,
  getTrenPenjualan,
} from "../api/laporanPenjualanApi";
import dayjs from "dayjs";

function LaporanPenjualan() {
  const [periode, setPeriode] = useState("HARIAN");
  const [openDetail, setOpenDetail] = useState(false);
  const [detailPenjualan, setDetailPenjualan] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [kontribusiProduk, setKontribusiProduk] = useState([]);
  const [trenPenjualan, setTrenPenjualan] = useState([]);

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [summary, setSummary] = useState({
    totalOmzet: 0,
    totalTransaksi: 0,
    produkTerjual: 0,
    rataRataPembelian: 0,
    cash: 0,
    cashless: 0,
  });

  const formatTanggal = (tanggal) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(tanggal);
  };

  const formatRupiah = (nominal) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(nominal || 0);
  };

  // Derived State
  const tidakAdaData = summary.totalTransaksi === 0;

  const totalPembayaran = (summary.cash || 0) + (summary.cashless || 0);

  const persenCash =
    totalPembayaran > 0 ? (summary.cash / totalPembayaran) * 100 : 0;

  const persenCashless =
    totalPembayaran > 0 ? (summary.cashless / totalPembayaran) * 100 : 0;

  const loadSummaryByPeriode = async () => {
    try {
      const data = await getSummaryLaporanPenjualanByPeriode(
        `${startDate}T00:00:00`,
        `${endDate}T23:59:59`,
      );
      const produk = await getKontribusiProduk(
        `${startDate}T00:00:00`,
        `${endDate}T23:59:59`,
      );

      setKontribusiProduk(produk);

      setSummary(data);
    } catch (error) {
      console.error("Gagal mengambil laporan berdasarkan periode:", error);
    }
  };

  const loadTrenPenjualan = async () => {
    try {
      const data = await getTrenPenjualan(
        `${startDate}T00:00:00`,
        `${endDate}T23:59:59`,
      );

      setTrenPenjualan(data);
    } catch (error) {
      console.error("Gagal mengambil tren penjualan:", error);
    }
  };

  const handlePeriodeChange = (value) => {
    setPeriode(value);

    const today = new Date();

    if (value === "HARIAN") {
      const date = today.toISOString().split("T")[0];

      setStartDate(date);
      setEndDate(date);
    }

    if (value === "BULANAN") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      setStartDate(firstDay.toISOString().split("T")[0]);
      setEndDate(lastDay.toISOString().split("T")[0]);
    }

    if (value === "TAHUNAN") {
      setStartDate(`${today.getFullYear()}-01-01`);
      setEndDate(`${today.getFullYear()}-12-31`);
    }
  };

  const handleLihatDetail = async () => {
    try {
      setLoadingDetail(true);

      const data = await getDetailLaporanPenjualan(
        `${startDate}T00:00:00`,
        `${endDate}T23:59:59`,
      );

      setDetailPenjualan(data);
      setOpenDetail(true);
    } catch (error) {
      console.error("Gagal mengambil detail penjualan:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadSummaryByPeriode();
    loadTrenPenjualan();
  }, [startDate, endDate]);

  const chartData = trenPenjualan.map((item) => ({
    label: item.label,
    omzet: item.omzet,
    transaksi: item.transaksi,
  }));

  return (
    <div className="px-3 py-5 md:p-5">
      {/* Header */}
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl">
          Laporan Penjualan
        </h1>

        <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 mt-1">
          <MdDateRange className="text-orange-500 text-lg" />

          <span>
            Periode {formatTanggal(new Date(startDate))} -{" "}
            {formatTanggal(new Date(endDate))}
          </span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col mb-3 md:flex-row gap-3 md:items-center">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onReset={() => {
            const today = new Date().toISOString().split("T")[0];

            setStartDate(today);
            setEndDate(today);
          }}
        />

        <DropDownFilter
          title="Periode"
          value={{
            label:
              periode === "HARIAN"
                ? "Harian"
                : periode === "BULANAN"
                  ? "Bulanan"
                  : "Tahunan",
            value: periode,
          }}
          items={[
            { label: "Harian", value: "HARIAN" },
            { label: "Bulanan", value: "BULANAN" },
            { label: "Tahunan", value: "TAHUNAN" },
          ]}
          onSelect={(item) => handlePeriodeChange(item.value)}
        />

        <button
          type="button"
          className="flex w-full md:w-auto md:ml-auto items-center justify-center gap-2
             rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white
             transition-all duration-300 hover:bg-orange-600 hover:scale-105
             disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LuDownload size={18} />
          Ekspor Laporan
        </button>
      </div>

      {tidakAdaData ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-20">
          <h3 className="font-semibold text-lg text-center">
            Tidak ada data penjualan
          </h3>

          <p className="text-gray-500 text-sm mt-2 text-center">
            Tidak ditemukan transaksi pada periode yang dipilih.
          </p>
        </div>
      ) : (
        <>
          {/* KPI CARD */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-6">
            {/* OMZET */}
            <Card className="xl:col-span-2 shadow-lg py-4 px-5">
              <p className="text-sm md:text-lg text-gray-500 font-medium">
                Total Penjualan
              </p>

              <h2 className="text-orange-500 text-3xl font-extrabold mt-2">
                <AnimatedCount
                  value={summary.totalOmzet}
                  formatter={formatRupiah}
                  duration={1500}
                />
              </h2>

              <div className="mt-5">
                <MiniChart />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-500 font-bold text-sm">▲ +12%</span>

                <span className="text-gray-400 text-sm">
                  dibanding bulan lalu
                </span>
              </div>
            </Card>

            {/* TOTAL TRANSAKSI */}
            <Card className="shadow-md p-4 flex flex-col justify-between">
              <div>
                <p className="text-sm md:text-lg text-gray-500 font-medium">
                  Total Transaksi
                </p>

                <div className="flex justify-between items-end mt-2">
                  <h2 className="text-2xl sm:text-6xl font-bold text-orange-500">
                    <AnimatedCount
                      value={summary.totalTransaksi}
                      duration={1500}
                    />
                  </h2>

                  <span className="text-base text-gray-400">pesanan</span>
                </div>
              </div>

              <button
                onClick={handleLihatDetail}
                className="mt-4 w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600
                text-white text-sm font-medium transition"
              >
                Lihat Detail
              </button>
            </Card>

            {/* MODAL */}
            <Modal
              isOpen={openDetail}
              onClose={() => setOpenDetail(false)}
              title="Detail Penjualan"
              maxWidth="max-w-6xl"
            >
              {loadingDetail ? (
                <div className="py-8 text-center">Memuat data...</div>
              ) : (
                <DetailTransaksiTable data={detailPenjualan} />
              )}
            </Modal>

            {/* RATA RATA + PRODUK TERJUAL */}
            <div className="flex flex-col gap-4">
              <Card className="shadow-md p-4">
                <p className="text-sm md:text-lg text-gray-500 font-medium">
                  Rata-rata Pembelian
                </p>

                <div className="mt-2">
                  <h2
                    className="text-lg sm:text-xl xl:text-2xl font-bold text-orange-500
                    break-words leading-tight"
                  >
                    <AnimatedCount
                      value={summary.rataRataPembelian}
                      formatter={formatRupiah}
                      duration={1500}
                    />
                  </h2>

                  <div className="flex justify-end">
                    <span className="text-base text-gray-400 mt-1">
                      /transaksi
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="shadow-md p-4">
                <p className="text-sm md:text-lg text-gray-500 font-medium">
                  Produk Terjual
                </p>

                <div className="mt-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-orange-500">
                    <AnimatedCount
                      value={summary.produkTerjual}
                      duration={1500}
                    />
                  </h2>

                  <span className="block text-right text-base text-gray-400 mt-1">
                    unit
                  </span>
                </div>
              </Card>
            </div>

            {/* METODE PEMBAYARAN */}
            <Card className="shadow-md p-4 flex flex-col justify-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-5">
                Metode Pembayaran
              </p>

              {/* CASH */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Cash</span>
                  <span className="font-medium">
                    <AnimatedCount
                      value={persenCash}
                      duration={1500}
                      formatter={(value) => `${Math.round(value)}%`}
                    />
                  </span>
                </div>

                <AnimatedProgressBar
                  value={summary.cash}
                  max={summary.cash + summary.cashless}
                  color="bg-green-500"
                  duration={1200}
                />

                <p className="text-xs text-gray-400 mt-1">
                  {formatRupiah(summary.cash)}
                </p>
              </div>

              {/* CASHLESS */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Cashless</span>
                  <span className="font-medium">
                    <AnimatedCount
                      value={persenCashless}
                      duration={1.5}
                      formatter={(value) => `${Math.round(value)}%`}
                    />
                  </span>
                </div>

                <AnimatedProgressBar
                  value={summary.cashless}
                  max={summary.cash + summary.cashless}
                  color="bg-[#5F04E8]"
                  duration={1200}
                />

                <p className="text-xs text-gray-400 mt-1">
                  {formatRupiah(summary.cashless)}
                </p>
              </div>

              {/* TOTAL */}
              <div className="mt-2 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Total:
                </span>

                <span className="text-base font-bold text-orange-500">
                  <AnimatedCount
                    value={totalPembayaran}
                    formatter={formatRupiah}
                    duration={1500}
                  />
                </span>
              </div>
            </Card>
          </div>

          {/* // */}
          {/* // */}
          {/* // */}

          {/* Grafik + Progress Bar */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="xl:col-span-2 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Tren Penjualan</h2>

                <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 mt-1">
                  <MdDateRange className="text-orange-500 text-lg" />

                  <span>
                    Periode {formatTanggal(new Date(startDate))} -{" "}
                    {formatTanggal(new Date(endDate))}
                  </span>
                </div>
              </div>

              <div
                className="h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px]
                rounded-xl border border-dashed border-orange-500
                overflow-hidden p-2"
              >
                <LineChartCard data={chartData} />
              </div>
            </Card>

            <Card className="shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Kontribusi Produk</h2>

                <span className="text-sm text-gray-500">
                  Top {kontribusiProduk.length} Produk
                </span>
              </div>

              <div className="rounded-xl border border-dashed border-gray-300 p-5 flex flex-col gap-6">
                {kontribusiProduk.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
                    Tidak ada data produk
                  </div>
                ) : (
                  kontribusiProduk.map((item) => (
                    <div key={item.namaProduk}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="truncate mr-2">{item.namaProduk}</span>

                        <span className="font-medium">
                          <AnimatedCount
                            value={item.persentase}
                            duration={1500}
                            formatter={(value) => `${Math.round(value)}%`}
                          />
                        </span>
                      </div>

                      <AnimatedProgressBar
                        value={item.persentase}
                        max={100}
                        color="bg-[#5F04E8]"
                        height="h-3"
                        duration={1200}
                      />

                      <p className="text-xs text-gray-400 mt-1">
                        <AnimatedCount
                          value={item.totalTerjual}
                          duration={1500}
                        />{" "}
                        unit
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default LaporanPenjualan;
