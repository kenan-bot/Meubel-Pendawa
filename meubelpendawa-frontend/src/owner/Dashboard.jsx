import Card from "../components/Card";
import { useEffect, useState } from "react";
import {
  getPengirimanBelumSelesai,
  getTransaksiTerbesarHariIni,
  getProdukTerlarisBulanIni,
} from "../api/dashboardApi";

import AnimatedCount from "../components/AnimatedCount";

import PengirimanBelumSelesaiContent from "../components/DashboardPengirimanContent";
import DashboardTransaksiContent from "../components/DashboardTransaksiContent";
import DashboardProdukTerlarisContent from "../components/DashboardProdukTerlarisContent";

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
      console.error(error);
    }
  };

  // card produk terlaris
  const [produkTerlaris, setProdukTerlaris] = useState([]);
  const loadProdukTerlaris = async () => {
    try {
      const response = await getProdukTerlarisBulanIni();

      setProdukTerlaris(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPengiriman();
    loadTransaksiTerbesar();
    loadProdukTerlaris();
  }, []);

  return (
    <div className="px-3 py-5 md:p-5">
      {/* HEADER */}
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl">Dashboard Owner</h1>
        <p className="text-sm md:text-base text-gray-500">
          Monitoring cepat dashboard pintar
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
            <p className="font-bold text-center">Top 3 Merek Populer</p>
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
            <p className="font-bold text-center">Top Wilayah Pelanggan</p>
          </Card>
        </div>

        <div className="col-span-2 row-span-1">
          <Card dashboard className="h-[300px]">
            <p className="font-bold text-center">Transaksi Terbaru</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
