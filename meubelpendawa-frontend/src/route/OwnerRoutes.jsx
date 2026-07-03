import { Routes, Route, Navigate } from "react-router-dom";

import OwnerLayout from "../owner/OwnerLayout";
import Dashboard from "../owner/Dashboard";
import Produk from "../owner/Produk";
import Karyawan from "../owner/Karyawan";
import AtributProduk from "../owner/AtributProduk";
import StatusPengiriman from "../owner/StatusPengiriman";
import LaporanPenjualan from "../owner/LaporanPenjualan";
import RiwayatLogin from "../owner/RiwayatLogin";

function OwnerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OwnerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="produk" element={<Produk />} />
        <Route path="karyawan" element={<Karyawan />} />
        <Route path="kategori" element={<AtributProduk />} />
        <Route path="statuspengiriman" element={<StatusPengiriman />} />
        <Route path="laporanpenjualan" element={<LaporanPenjualan />} />
        <Route path="riwayatlogin" element={<RiwayatLogin />} />
      </Route>
    </Routes>
  );
}

export default OwnerRoutes;