import RupiahInput from "./RupiahInput";
import { useTransaksi } from "../context/TransaksiContext";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

const RingkasanBayar = ({ onRequestProses }) => {
  const {
    jumlahBayar, setJumlahBayar, kembalian, totalPesanan,
    isCashless, submitting,
  } = useTransaksi();

  return (
    <div className="bg-orange-500 text-white rounded-lg p-3 space-y-1.5 text-xs">
      {isCashless ? (
        // CASHLESS: nominal otomatis = totalPesanan lewat QRIS, gak ada uang tunai/kembalian
        // yang perlu diisi manual -- jadi field itu disembunyikan biar kasir gak salah isi.
        <p className="text-[11px] text-white/80">Dibayar via QRIS, nominal otomatis sesuai total.</p>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span>Jumlah Bayar</span>
            <div className="w-28 [&_label]:hidden [&_input]:w-full [&_input]:text-right [&_input]:px-1.5 [&_input]:py-1 [&_input]:rounded [&_input]:text-orange-600 [&_input]:font-semibold [&_input]:text-xs [&_input]:border-0 [&_input]:focus:outline-none">
              <RupiahInput value={jumlahBayar} onChange={setJumlahBayar} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Kembalian</span>
            <span className="font-semibold">{formatRupiah(kembalian > 0 ? kembalian : 0)}</span>
          </div>
        </>
      )}

      <div className="flex items-center justify-between text-sm font-bold pt-1 border-t border-white/30">
        <span>Total</span>
        <span>{formatRupiah(totalPesanan)}</span>
      </div>
      <div className="pt-1.5">
        <button type="button" disabled={submitting} onClick={onRequestProses}
          className="w-full py-1.5 bg-gray-800 hover:bg-gray-900 transition rounded-md text-[11px] font-semibold disabled:opacity-50">
          {submitting ? "Memproses..." : "Proses Pesanan"}
        </button>
      </div>
    </div>
  );
};

export default RingkasanBayar;