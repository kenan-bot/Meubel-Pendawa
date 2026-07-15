import { FaCheckCircle, FaPrint, FaEnvelope } from "react-icons/fa";
import Modal from "./Modal";
import { getStrukPdfUrl } from "../api/strukApi";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

// Modal struk
const StrukModal = ({ data, onClose }) => {
  if (!data) return null;

  const isDelivery = data.metodePengiriman?.toUpperCase() === "DELIVERY";
  const isCash = data.metodePembayaran?.toUpperCase() === "CASH";

  const bukaPdf = () => window.open(getStrukPdfUrl(data.orderId), "_blank");

  return (
    <Modal isOpen={!!data} onClose={onClose} title="Pesanan Berhasil" maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center gap-1 pb-3">
        <FaCheckCircle className="text-green-500" size={36} />
        <p className="text-sm text-gray-600">
          Pesanan <span className="font-bold text-[#5F04E8]">#{data.orderId}</span> berhasil diproses.
        </p>
      </div>

      <div className="border border-gray-100 rounded-xl p-3.5 bg-gray-50 text-xs text-gray-700 space-y-2">
        <div className="flex justify-between"><span className="text-gray-500">Nama Pemesan</span><span className="font-semibold">{data.namaPemesan}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">No. WhatsApp</span><span className="font-semibold">{data.noWhatsapp}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Pengiriman</span><span className="font-semibold">{isDelivery ? "Delivery" : "Pick Up"}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Pembayaran</span><span className="font-semibold">{isCash ? "Cash" : "Cashless (QRIS)"}</span></div>

        <div className="pt-2 border-t border-gray-200 space-y-1 max-h-32 overflow-y-auto">
          {data.items.map((it, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="truncate pr-2">{it.namaProduk} x{it.qty}</span>
              <span className="flex-shrink-0">{formatRupiah(it.qty * it.hargaJual)}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-gray-200 space-y-1">
          <div className="flex justify-between font-bold text-sm text-[#5F04E8]">
            <span>Total</span><span>{formatRupiah(data.totalPesanan)}</span>
          </div>
          <div className="flex justify-between"><span className="text-gray-500">Jumlah Bayar</span><span>{formatRupiah(data.jumlahBayar)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Kembalian</span><span>{formatRupiah(data.kembalian)}</span></div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 px-2.5 py-2 rounded-md bg-blue-50 text-[11px] text-blue-600">
        <FaEnvelope className="flex-shrink-0" />
        <span>Struk PDF otomatis dikirim ke email toko (meubelpendawa@gmail.com).</span>
      </div>

      <div className="flex gap-2 mt-3">
        <button type="button" onClick={bukaPdf}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold text-white bg-[#5F04E8] hover:bg-[#4d03bd] transition">
          <FaPrint size={12} /> Cetak / Download PDF
        </button>
        <button type="button" onClick={onClose}
          className="flex-1 py-2 rounded-md text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition">
          Tutup
        </button>
      </div>
    </Modal>
  );
};

export default StrukModal;
