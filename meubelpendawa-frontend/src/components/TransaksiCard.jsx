import {
  FaUserCircle,
  FaShippingFast,
  FaMapMarkerAlt,
  FaTruck,
  FaCheckCircle,
  FaCar,
  FaWhatsapp,
  FaPrint,
} from "react-icons/fa";

import AnimatedSection from "./AnimatedSection";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

function formatTanggal(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatWhatsapp(number) {
  if (!number) return "";

  let phone = number.replace(/\D/g, "");

  if (phone.startsWith("0")) {
    phone = "62" + phone.slice(1);
  }

  return phone;
}

const TransaksiCard = ({
  transaksi: t,
  items = [],
  variant,
  statusPengiriman,
  canUpdate = false,
  onUpdateStatus,
}) => {
  const isDelivery = t.metodePengiriman?.toUpperCase() === "DELIVERY";

  const isCash = t.metodePembayaran?.toUpperCase() === "CASH";

  const isCompleted = statusPengiriman === "COMPLETED";

  return (
    <AnimatedSection>
      <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
        {/* ================= HEADER ================= */}

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 min-w-0">
            <FaUserCircle size={34} className="flex-shrink-0 text-[#5F04E8]" />

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[#5F04E8] break-words leading-none">
                {t.namaPemesan}
              </h3>

              <a
                href={`https://wa.me/${formatWhatsapp(
                  t.noWhatsapp,
                )}?text=${encodeURIComponent(
                  `Halo ${t.namaPemesan}, pesanan Anda sedang dalam proses pengiriman dari Toko Meubel Pendawa.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition hover:underline"
              >
                <FaWhatsapp size={12} />
                {t.noWhatsapp}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {variant === "riwayat" && (
              <button
                type="button"
                title="Cetak Struk"
                onClick={() => window.print()}
                className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-[#5F04E8]"
              >
                <FaPrint size={14} />
              </button>
            )}

            <span className="whitespace-nowrap rounded-full bg-[#5F04E8]/10 px-3 py-1 text-[10px] font-bold text-[#5F04E8]">
              #{t.orderId}
            </span>
          </div>
        </div>

        {/* ================= INFO ================= */}

        {variant === "pengiriman" ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <FaShippingFast
                size={20}
                className="text-orange-500 flex-shrink-0"
              />

              <span className="truncate text-xs font-medium text-gray-600">
                {t.driver?.namaKaryawan || "-"}
              </span>
            </div>

            <span className="whitespace-nowrap text-xs text-gray-500">
              {t.tanggalTransaksi
                ? formatTanggal(new Date(t.tanggalTransaksi))
                : "-"}
            </span>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2">
            <span className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
              {isDelivery ? (
                <FaShippingFast size={20} className="text-orange-500" />
              ) : (
                <FaCar className="text-orange-500" />
              )}

              {isDelivery ? "Delivery" : "Pick Up"}
            </span>

            <span className="whitespace-nowrap text-xs text-gray-500">
              {t.tanggalTransaksi
                ? formatTanggal(new Date(t.tanggalTransaksi))
                : "-"}
            </span>
          </div>
        )}

        {/* ================= ITEM ================= */}

        <div className="mt-5">
          <div className="grid grid-cols-[1fr_48px_110px] gap-3 border-b border-gray-200 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            <span>Items</span>

            <span className="text-center">Qty</span>

            <span className="text-right">Harga</span>
          </div>

          <div className="mt-2 max-h-32 space-y-1 overflow-y-auto pr-1">
            {items.length > 0 ? (
              items.map((d) => (
                <div
                  key={d.idDetailTransaksi}
                  className="grid grid-cols-[1fr_48px_110px] items-start gap-3 rounded-lg px-1 py-1.5 hover:bg-gray-50"
                >
                  <span
                    className="text-sm text-gray-700 break-words leading-none"
                    title={d.namaProduk}
                  >
                    {d.namaProduk}
                  </span>

                  <span className="text-center text-sm font-medium text-gray-700">
                    {d.qty}
                  </span>

                  <span className="whitespace-nowrap text-right text-sm font-semibold text-gray-700">
                    {formatRupiah(d.hargaJual)}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-5 text-center text-sm text-gray-400">
                Tidak ada item.
              </div>
            )}
          </div>
        </div>
        {/* ================= FOOTER ================= */}

        {variant === "pengiriman" ? (
          <>
            {/* Total */}
            <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="text-sm font-medium text-gray-500">Total</span>

              <span className="whitespace-nowrap text-lg font-bold text-[#5F04E8]">
                {formatRupiah(t.totalPesanan)}
              </span>
            </div>

            {/* Alamat */}
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <FaMapMarkerAlt className="mt-0.5 flex-shrink-0 text-orange-500" />

              <span className="break-words text-sm leading-relaxed text-gray-600">
                {t.alamatPengiriman || "-"}
              </span>
            </div>

            {/* Tombol / Status */}
            {canUpdate ? (
              <button
                type="button"
                disabled={isCompleted}
                onClick={() => onUpdateStatus?.(t)}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition
                  ${
                    isCompleted
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-orange-500 hover:bg-orange-600 active:scale-[0.99]"
                  }`}
              >
                {isCompleted ? (
                  <>
                    <FaCheckCircle size={14} />
                    Completed
                  </>
                ) : (
                  <>
                    <FaTruck size={14} />
                    Selesaikan Pengiriman
                  </>
                )}
              </button>
            ) : (
              <div
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white
                  ${isCompleted ? "bg-[#5F04E8]" : "bg-orange-500"}`}
              >
                {isCompleted ? (
                  <>
                    <FaCheckCircle size={14} />
                    Completed
                  </>
                ) : (
                  <>
                    <FaTruck size={14} />
                    On Process
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Informasi Pembayaran */}
            <div className="mt-5 space-y-2 border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">Metode Pembayaran</span>

                <span
                  className={`whitespace-nowrap text-sm font-semibold ${
                    isCash ? "text-orange-500" : "text-[#5F04E8]"
                  }`}
                >
                  {isCash ? "Cash" : "Cashless"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">Total Bayar</span>

                <span className="whitespace-nowrap text-right text-sm font-semibold text-gray-700">
                  {formatRupiah(t.jumlahBayar)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">Kembalian</span>

                <span className="whitespace-nowrap text-right text-sm font-semibold text-gray-700">
                  {formatRupiah(t.kembalian)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="text-base font-bold text-gray-700">Total</span>

              <span className="whitespace-nowrap text-lg font-bold text-[#5F04E8]">
                {formatRupiah(t.totalPesanan)}
              </span>
            </div>
          </>
        )}
      </div>
    </AnimatedSection>
  );
};

export default TransaksiCard;
