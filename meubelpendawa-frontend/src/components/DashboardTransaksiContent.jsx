import { MdWorkspacePremium, MdOutlineAccessTimeFilled } from "react-icons/md";
import AnimatedCount from "./AnimatedCount";

const DashboardTransaksiContent = ({
  orderId,
  namaPemesan,
  total,
  waktuTransaksi,
  metodePembayaran,
}) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value ?? 0);

  const formatTime = (date) => {
    if (!date) return "--:--";

    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold text-sm sm:text-base text-gray-900 leading-tight truncate">
          Transaksi Terbesar Hari Ini
        </h2>

        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
          <MdOutlineAccessTimeFilled className="text-[11px] sm:text-[13px]" />
          <span>{formatTime(waktuTransaksi)}</span>
        </div>
      </div>

      {/* Nama */}
      <div className="mt-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] sm:text-[13px] font-medium tracking-wide text-gray-400">
            Nama Pemesan
          </p>

          <div className="flex items-center gap-1 bg-orange-500 text-white rounded-md px-1.5 py-0.5 flex-shrink-0 max-w-[48%]">
            <MdWorkspacePremium className="text-[10px] sm:text-[12px] flex-shrink-0" />

            <span className="text-[9px] sm:text-[11px] md:text-[12px] font-semibold truncate">
              {orderId}
            </span>
          </div>
        </div>

        <h3 className="-mt-2 font-bold text-base sm:text-lg text-gray-900 leading-tight truncate">
          {namaPemesan}
        </h3>
      </div>

      {/* Footer */}
      <div className="mt-1 pt-1 border-t border-dashed border-gray-200">
        <p className="text-[10px] sm:text-[13px] font-medium tracking-wide text-gray-400">
          Total Transaksi
        </p>

        <div className="flex items-end justify-between gap-2 -mt-1">
          <AnimatedCount
            value={Number(total)}
            formatter={formatCurrency}
            className="flex-1 min-w-0 text-lg sm:text-lg md:text-xl lg:text-2xl font-extrabold text-orange-500 leading-none truncate"
          />

          <span
            className={`flex-shrink-0 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold whitespace-nowrap ${
              metodePembayaran === "CASH"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            {metodePembayaran}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardTransaksiContent;
