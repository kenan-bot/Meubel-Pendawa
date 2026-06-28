import { Routes, Route, Navigate } from "react-router-dom";

import KasirLayout from "../kasir/KasirLayout";
import Transaksi from "../kasir/Transaksi";
import StatusPengiriman from "../kasir/StatusPengiriman";
import RiwayatHarian from "../kasir/RiwayatHarian";

function KasirRoutes() {
  return (
    <Routes>
      <Route path="/" element={<KasirLayout />}>
        <Route index element={<Navigate to="transaksi" replace />} />

        <Route path="transaksi" element={<Transaksi />} />
        <Route path="statuspengiriman" element={<StatusPengiriman />} />
        <Route path="riwayatharian" element={<RiwayatHarian />} />
      </Route>
    </Routes>
  );
}

export default KasirRoutes;