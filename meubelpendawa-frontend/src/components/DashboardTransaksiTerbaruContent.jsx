import { FaReceipt } from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatJam(tanggal) {
  return new Date(tanggal).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DashboardTransaksiTerbaruContent({ transaksi = [] }) {
  return (
    <div className="h-full flex flex-col overflow-visible">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0">
          <h3 className="font-bold text-base sm:text-xl text-gray-800 truncate">
            Transaksi Terbaru
          </h3>

          <p className="text-xs sm:text-sm text-gray-500">
            5 Transaksi Terakhir
          </p>
        </div>

        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
          <FaReceipt className="text-orange-500 text-lg sm:text-xl" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-3 overflow-visible">
        {transaksi.map((item, index) => (
          <AnimatedSection
            key={item.orderId}
            delay={index * 0.08}
            y={15}
            scale={0.97}
          >
            <div
              className="bg-gray-50 border border-l-4 border-orange-500 border-gray-200 rounded-md
              px-3 sm:px-4 py-2 flex items-center justify-between gap-3 relative transition-all
              duration-300 hover:scale-110 hover:z-20 hover:shadow-sm cursor-pointer"
            >
              {/* Kiri */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>

                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base text-gray-800 truncate">
                    {item.namaPemesan}
                  </div>

                  <div className="text-xs text-gray-500 truncate">
                    {item.orderId}
                  </div>
                </div>
              </div>

              {/* Kanan */}
              <div className="text-right flex-shrink-0 min-w-0">
                <div className="font-bold text-sm sm:text-base text-orange-500 truncate">
                  {formatRupiah(item.totalPesanan)}
                </div>

                <div className="text-xs text-gray-500">
                  {formatJam(item.tanggalTransaksi)}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}

export default DashboardTransaksiTerbaruContent;
