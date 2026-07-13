import Card from "../components/Card";
import { useEffect, useState } from "react";
import {
  getPengirimanBelumSelesai,
  getTransaksiTerbesarHariIni,
  getProdukTerlarisBulanIni,
  getTopMerekPopuler,
  getTransaksiTerbaru,
  getTopWilayahPelanggan,
} from "../api/dashboardApi";

import AnimatedCount from "../components/AnimatedCount";

import PengirimanBelumSelesaiContent from "../components/DashboardPengirimanContent";
import DashboardTransaksiContent from "../components/DashboardTransaksiContent";
import DashboardProdukTerlarisContent from "../components/DashboardProdukTerlarisContent";
import DashboardMerekPopulerContent from "../components/DashboardMerekPopuler";
import DashboardTransaksiTerbaruContent from "../components/DashboardTransaksiTerbaruContent";
import DashboardWilayahPelangganContent from "../components/DashboardWilayahPelangganContent";

function Dashboard() {
  //card pengiriman
  const [pengirimanData, setPengirimanData] = useState(null);
  const loadPengiriman = async () => {
    try {
      const data = await getPengirimanBelumSelesai();

      setPengirimanData(data);
    } catch (error) {
      console.error("Gagal memuat data pengiriman", error);
    }
  };

  //card transaksi terbesar
  const [transaksiTerbesar, setTransaksiTerbesar] = useState(null);
  const loadTransaksiTerbesar = async () => {
    try {
      const response = await getTransaksiTerbesarHariIni();

      setTransaksiTerbesar(response);
    } catch (error) {
      console.error("Gagal memuat data transaksi terbesar", error);
    }
  };

  // card produk terlaris
  const [produkTerlaris, setProdukTerlaris] = useState([]);
  const loadProdukTerlaris = async () => {
    try {
      const response = await getProdukTerlarisBulanIni();

      setProdukTerlaris(response);
    } catch (error) {
      console.error("Gagal memuat data produk terlaris", error);
    }
  };

  // card merek populer
  const [topMerekPopuler, setTopMerekPopuler] = useState([]);
  const loadTopMerekPopuler = async () => {
    try {
      const data = await getTopMerekPopuler();

      setTopMerekPopuler(data);
    } catch (error) {
      console.error("Gagal memuat data merek populer", error);
    }
  };

  // card transaksi terbaru
  const [transaksiTerbaru, setTransaksiTerbaru] = useState([]);
  const loadTransaksiTerbaru = async () => {
    try {
      const response = await getTransaksiTerbaru();

      setTransaksiTerbaru(response);
    } catch (error) {
      console.error("Gagal memuat data transaksi terbaru", error);
    }
  };

  // card top wilayah pelanggan
  const [topWilayahPelanggan, setTopWilayahPelanggan] = useState([]);
  const loadTopWilayahPelanggan = async () => {
    try {
      const response = await getTopWilayahPelanggan();

      setTopWilayahPelanggan(response);
    } catch (error) {
      console.error("Gagal memuat data wilayah pelanggan", error);
    }
  };

  useEffect(() => {
    loadPengiriman();
    loadTransaksiTerbesar();
    loadProdukTerlaris();
    loadTopMerekPopuler();
    loadTransaksiTerbaru();
    loadTopWilayahPelanggan();
  }, []);

  return (
    <div className="px-3 py-5 md:p-5">
      {/* HEADER */}
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl">
          Dashboard Pintar
        </h1>
        <p className="text-sm md:text-base text-gray-500">
          Monitoring cepat performa bisnis dalam satu ruang
        </p>
      </div>

      {/* GRID DASHBOARD */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Row 1 */}
        <div className="col-span-1 row-span-1">
          <Card dashboard padding="small" className="h-[170px]">
            {!transaksiTerbesar ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-gray-400">Memuat data...</span>
              </div>
            ) : (
              <DashboardTransaksiContent
                orderId={transaksiTerbesar.orderId}
                namaPemesan={transaksiTerbesar.namaPemesan}
                total={transaksiTerbesar.total}
                waktuTransaksi={transaksiTerbesar.waktuTransaksi}
                metodePembayaran={transaksiTerbesar.metodePembayaran}
              />
            )}
          </Card>
        </div>

        <div className="col-span-1 row-span-1">
          <Card dashboard className="h-[170px]">
            {topMerekPopuler.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-gray-400">Memuat merek populer...</span>
              </div>
            ) : (
              <DashboardMerekPopulerContent merek={topMerekPopuler} />
            )}
          </Card>
        </div>

        <div className="col-span-1 row-span-2">
          <Card dashboard className="h-[380px]">
            {!pengirimanData ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-gray-400">Memuat data...</span>
              </div>
            ) : (
              <PengirimanBelumSelesaiContent
                totalAktif={pengirimanData.totalAktif}
                totalTerlambat={pengirimanData.totalTerlambat}
                drivers={pengirimanData.drivers}
              />
            )}
          </Card>
        </div>

        <div className="col-span-1 row-span-2">
          <Card dashboard className="h-[380px]">
            {produkTerlaris.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-gray-400">Memuat produk terlaris...</span>
              </div>
            ) : (
              <DashboardProdukTerlarisContent produk={produkTerlaris} />
            )}
          </Card>
        </div>

        {/* Row 2-3 */}
        <div className="col-span-2 row-span-2">
          <Card dashboard className="h-[480px]">
            <p className="font-bold text-center">Trafik Transaksi Mingguan</p>
          </Card>
        </div>

        <div className="col-span-1 row-span-1">
          <Card dashboard className="h-[270px]">
            <p className="font-bold text-center">Cash / Cashless</p>
          </Card>
        </div>

        <div className="col-span-1 row-span-1">
          <Card dashboard className="h-[270px]">
            <p className="font-bold text-center">Stok Menipis</p>
          </Card>
        </div>

        {/* Row 4 */}
        <div className="col-span-2 row-span-1">
          <Card dashboard className="h-[300px]">
            {topWilayahPelanggan.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-gray-400">
                  Memuat wilayah pelanggan...
                </span>
              </div>
            ) : (
              <DashboardWilayahPelangganContent wilayah={topWilayahPelanggan} />
            )}
          </Card>
        </div>

        <div className="col-span-2 row-span-1">
          <Card dashboard className="h-[300px]">
            {transaksiTerbaru.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-gray-400">
                  Memuat transaksi terbaru...
                </span>
              </div>
            ) : (
              <DashboardTransaksiTerbaruContent transaksi={transaksiTerbaru} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
