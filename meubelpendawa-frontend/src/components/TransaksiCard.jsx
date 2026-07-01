/**
 * TransaksiCard — kartu transaksi reusable.
 *
 * Dipakai di dua halaman kasir:
 *   variant="pengiriman" → StatusPengiriman  (tampilkan driver, alamat, badge status)
 *   variant="riwayat"    → RiwayatHarian     (tampilkan metode bayar, kembalian, tombol print)
 *
 * Props:
 *   transaksi        {object}  — data transaksi dari API
 *   items            {Array}   — detail item (sudah difilter per orderId)
 *   variant          {string}  — "pengiriman" | "riwayat"
 *   statusPengiriman {string}  — "ON_PROCESS" | "COMPLETED" (hanya untuk variant "pengiriman")
 */

import {
  FaUserCircle, FaMotorcycle, FaMapMarkerAlt,
  FaTruck, FaCheckCircle, FaCar, FaPrint,
} from "react-icons/fa";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

function formatTanggal(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${dd} - ${mm} - ${yyyy} : ${hh}:${mi}:${ss}`;
}

const TransaksiCard = ({ transaksi: t, items = [], variant, statusPengiriman }) => {
  const isDelivery = t.metodePengiriman?.toUpperCase() === "DELIVERY";
  const isCash     = t.metodePembayaran?.toUpperCase() === "CASH";
  const isCompleted = statusPengiriman === "COMPLETED";

  return (
    <div className="border border-gray-100 rounded-xl shadow-sm p-3.5 flex flex-col bg-white">

      {/* ── Header: avatar + nama + WA | (print) + orderId ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FaUserCircle className="text-[#5F04E8] flex-shrink-0" size={28} />
          <div className="min-w-0">
            <p className="font-bold text-sm text-[#5F04E8] truncate">{t.namaPemesan}</p>
            <p className="text-[11px] text-gray-400">{t.noWhatsapp}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {variant === "riwayat" && (
            <button type="button" title="Cetak struk"
              className="text-gray-400 hover:text-[#5F04E8] transition"
              onClick={() => window.print()}>
              <FaPrint size={13} />
            </button>
          )}
          <span className="px-2 py-0.5 rounded-full bg-[#5F04E8]/10 text-[#5F04E8] text-[10px] font-bold whitespace-nowrap">
            #{t.orderId}
          </span>
        </div>
      </div>

      {/* ── Info row: berbeda per variant ── */}
      {variant === "pengiriman" ? (
        <div className="flex items-center justify-between mt-2.5 px-2 py-1.5 rounded-md bg-gray-50 text-[11px] text-gray-500">
          <span className="flex items-center gap-1 truncate">
            <FaMotorcycle className="text-orange-500 flex-shrink-0" />
            {t.driver?.namaKaryawan || "-"}
          </span>
          <span className="whitespace-nowrap">
            {t.tanggalTransaksi ? formatTanggal(new Date(t.tanggalTransaksi)) : "-"}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-2.5 flex-wrap gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">
            {isDelivery ? <FaMotorcycle className="text-orange-500" /> : <FaCar className="text-orange-500" />}
            {isDelivery ? "Delivery" : "Pick Up"}
          </span>
          <span className="text-[11px] text-gray-400 whitespace-nowrap">
            {t.tanggalTransaksi ? formatTanggal(new Date(t.tanggalTransaksi)) : "-"}
          </span>
        </div>
      )}

      {/* ── Tabel items (sama untuk kedua variant) ── */}
      <div className="mt-3">
        <div className="flex justify-between text-[11px] font-semibold text-gray-400 mb-1">
          <span>Items</span>
          <span className="flex gap-6"><span>Qty</span><span>Harga</span></span>
        </div>
        <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
          {items.map((d) => (
            <div key={d.idDetailTransaksi} className="flex justify-between text-xs text-gray-700">
              <span className="truncate pr-2">{d.produk?.namaProduk}</span>
              <span className="flex gap-6 flex-shrink-0">
                <span className="w-4 text-center">{d.qty}</span>
                <span>{formatRupiah(d.hargaJual)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer: berbeda per variant ── */}
      {variant === "pengiriman" ? (
        <>
          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Total</span>
            <span className="font-bold text-[#5F04E8] text-sm">{formatRupiah(t.totalPesanan)}</span>
          </div>
          <div className="flex items-start gap-1.5 mt-2 px-2.5 py-2 rounded-md border border-gray-200 text-[11px] text-gray-500">
            <FaMapMarkerAlt className="text-orange-500 flex-shrink-0 mt-0.5" />
            <span>{t.alamatPengiriman}</span>
          </div>
          {/* Badge status — read only untuk kasir */}
          <div className={`mt-3 w-full flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-semibold text-white select-none cursor-default ${isCompleted ? "bg-[#5F04E8]" : "bg-orange-500"}`}>
            {isCompleted ? <FaCheckCircle size={12} /> : <FaTruck size={12} />}
            {isCompleted ? "Completed" : "On Process"}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Metode Pembayaran</span>
            <span className={`font-semibold ${isCash ? "text-orange-500" : "text-[#5F04E8]"}`}>
              {isCash ? "Cash" : "Cashless"}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className="text-gray-500 font-medium">Total Bayar</span>
            <span className="text-gray-700 font-semibold">{formatRupiah(t.jumlahBayar)}</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className="text-gray-500 font-medium">Kembalian</span>
            <span className="text-gray-700 font-semibold">{formatRupiah(t.kembalian)}</span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-700">Total</span>
            <span className="font-bold text-[#5F04E8] text-base">{formatRupiah(t.totalPesanan)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TransaksiCard;