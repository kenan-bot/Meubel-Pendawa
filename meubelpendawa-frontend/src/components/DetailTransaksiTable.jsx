import React from "react";

export default function DetailTransaksiTable({ data = [] }) {
  const formatRupiah = (nominal) => {
    return "Rp " + Number(nominal || 0).toLocaleString("id-ID");
  };

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (data.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        Tidak ada data transaksi.
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[500px] border border-gray-200 rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-orange-500 text-white z-10">
          <tr>
            <th className="px-4 py-3 text-center">No</th>
            <th className="px-4 py-3 text-left">Tanggal</th>
            <th className="px-4 py-3 text-left">Order ID</th>
            <th className="px-4 py-3 text-left">Pemesan</th>
            <th className="px-4 py-3 text-left">Produk</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-center">Pembayaran</th>
            <th className="px-4 py-3 text-center">Pengiriman</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.orderId}
              className="border-b border-gray-200 hover:bg-orange-50 transition-colors"
            >
              <td className="px-4 py-3 text-center">{item.no}</td>

              <td className="px-4 py-3 whitespace-nowrap">
                {formatTanggal(item.tanggal)}
              </td>

              <td className="px-4 py-3 font-medium text-[#5F04E8]">
                {item.orderId}
              </td>

              <td className="px-4 py-3">{item.pemesan}</td>

              <td className="px-4 py-3">{item.produk}</td>

              <td className="px-4 py-3 text-right font-semibold text-[#5F04E8] whitespace-nowrap">
                {formatRupiah(item.total)}
              </td>

              <td className="px-4 py-3 text-center">
                <span className="px-2 py-1 rounded-full bg-purple-100 text-[#5F04E8] text-xs font-semibold">
                  {item.pembayaran}
                </span>
              </td>

              <td className="px-4 py-3 text-center">
                <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                  {item.pengiriman}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
