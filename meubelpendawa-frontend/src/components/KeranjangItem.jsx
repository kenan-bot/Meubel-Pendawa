import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import RupiahInput from "./RupiahInput";
import { useTransaksi } from "../context/TransaksiContext";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

const KeranjangItem = ({ item }) => {
  const { ubahQty, hapusItem, ubahHarga } = useTransaksi();
  const [showInput, setShowInput] = useState(false);
  const [hargaInput, setHargaInput] = useState(item.hargaJual);
  const idProduk = item.produk.idProduk;

  useEffect(() => {
    setHargaInput(item.hargaJual);
  }, [item.hargaJual]);

  return (
    <div className="flex gap-2 items-start border-b border-gray-100 pb-2.5">
      <div className="w-9 h-9 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
        {item.produk.gambarUrl && (
          <img
            src={item.produk.gambarUrl}
            alt={item.produk.namaProduk}
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-1">
          <p className="font-semibold text-xs text-gray-800 truncate">
            {item.produk.namaProduk}
          </p>
          <button
            onClick={() => hapusItem(idProduk)}
            className="text-red-500 hover:text-red-700 flex-shrink-0"
          >
            <FaTrash size={11} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400">
          Qty: {item.qty} x {formatRupiah(item.hargaJual)}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => ubahQty(idProduk, -1)}
              className="w-4 h-4 rounded-full border border-gray-300 text-gray-500 text-[10px] flex items-center justify-center"
            >
              -
            </button>
            <span className="text-xs">{item.qty}</span>
            <button
              onClick={() => ubahQty(idProduk, 1)}
              className="w-4 h-4 rounded-full border border-gray-300 text-gray-500 text-[10px] flex items-center justify-center"
            >
              +
            </button>
          </div>
          <span className="font-bold text-[#5F04E8] text-xs">
            {formatRupiah(item.qty * item.hargaJual)}
          </span>
        </div>
        {showInput ? (
          <div className="mt-1.5 [&_label]:hidden [&_input]:text-[11px] [&_input]:py-1 [&_input]:px-1.5 [&_input]:border-orange-300">
            <RupiahInput value={hargaInput} onChange={setHargaInput} />

            <button
              type="button"
              onClick={() => {
                const hargaDefault = Number(item.produk.hargaDefault);
                const hargaMinimum = hargaDefault * 0.9;

                if (Number(hargaInput) < hargaMinimum) {
                  alert(
                    `Harga terlalu rendah!\n\nHarga minimal yang diperbolehkan adalah ${formatRupiah(hargaMinimum)}`,
                  );
                  return;
                }

                ubahHarga(idProduk, Number(hargaInput));

                alert("Harga berhasil diperbarui.");
              }}
              className="mt-1 text-[10px] text-gray-400 underline"
            >
              Selesai
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="mt-1.5 text-[10px] px-1.5 py-0.5 border border-orange-400 text-orange-500 rounded-md"
          >
            Atur Harga
          </button>
        )}
      </div>
    </div>
  );
};

export default KeranjangItem;
