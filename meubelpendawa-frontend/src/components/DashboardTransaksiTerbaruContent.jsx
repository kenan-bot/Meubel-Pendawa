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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-gray-800">Transaksi Terbaru</h3>

          <p className="text-gray-500">5 Transaksi Terakhir</p>
        </div>

        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
          <FaReceipt className="text-orange-500 text-xl" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-3">
        {transaksi.map((item, index) => (
          <AnimatedSection
            key={item.orderId}
            delay={index * 0.08}
            y={15}
            scale={0.97}
          >
            <div
              className="
                flex
                items-center
                justify-between
                rounded-lg
                border
                border-gray-100
                px-3
                py-2
                hover:bg-orange-50
                hover:border-orange-300
                transition-all
                duration-300
                cursor-pointer
              "
            >
              {/* Kiri */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>

                <div>
                  <div className="font-semibold text-gray-800">
                    {item.namaPemesan}
                  </div>

                  <div className="text-xs text-gray-500">{item.orderId}</div>
                </div>
              </div>

              {/* Kanan */}
              <div className="text-right">
                <div className="font-bold text-orange-500">
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
